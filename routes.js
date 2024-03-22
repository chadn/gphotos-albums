'use strict';

import {config} from './config.js';
import passport from 'passport';
import persist from 'node-persist';
import fetch from 'node-fetch';
import { Router } from 'express';
const router = Router();


// GET request to the root.
// Display the login screen if the user is not logged in yet, otherwise the
// photo frame.
router.get('/', (req, res) => {
  if (!req.user || !req.isAuthenticated()) {
    // Not logged in yet.
    res.render('pages/login');
  } else {
    res.render('pages/album-details');
  }
});

// GET request to log out the user.
// Destroy the current session and redirect back to the log in screen.
router.get('/logout', (req, res) => {
  req.logout( (err) => {
    if (err) {
      router.logger.error(JSON.stringify({'Logout Error':err}));
    } else {
      router.logger.info('User has logged out.');
    }
    req.session.destroy();
    res.redirect('/');
  });
});

// Star the OAuth login process for Google.
router.get('/auth/google', passport.authenticate('google', {
  scope: config.scopes,
  failureFlash: true,  // Display errors to the user.
  session: true,
}));

// Callback receiver for the OAuth process after log in.
router.get(
    '/auth/google/callback',
    passport.authenticate(
        'google', {failureRedirect: '/', failureFlash: true, session: true}),
    (req, res) => {
      // User has logged in.
      router.logger.info('/auth/google/callback User has logged in.');

      // TODO: Remove or fix, req.session.lastPage is not remembered after set in /reauth/
      const lastPage = (req.session && req.session.lastPage) ? req.session.lastPage : '/';
      req.session.save(() => {
        router.logger.info('/auth/google/callback redirect to: '+ lastPage);
        res.redirect(lastPage);
      });
    });


// Loads the album page if the user is authenticated.
// This page displays a list of albums owned by the user.
router.get('/album', (req, res) => {
  renderIfAuthenticated(req, res, 'pages/album');
});

// Loads the album details page if the user is authenticated.
// This page displays lots of details of each album owned by the user.
router.get('/album-details', (req, res) => {
  renderIfAuthenticated(req, res, 'pages/album-details');
});


// Handles selections from the album page where an album ID is submitted.
// The user has selected an album and wants to load photos from an album
// into the photo frame.
// Submits a search for all media items in an album to the Library API.
// Returns a list of photos if this was successful, or an error otherwise.
router.post('/loadFromAlbum', async (req, res) => {
  redirectUnlessAuthenticated(req, res);
  const albumId = req.body.albumId;
  const userId = req.user.profile.id;
  const authToken = req.user.token;

  router.logger.info(`Importing album: ${albumId}`);

  // To list all media in an album, construct a search request
  // where the only parameter is the album ID.
  // Note that no other filters can be set, so this search will
  // also return videos that are otherwise filtered out in libraryApiSearch(..).
  const parameters = {albumId};

  // Submit the search request to the API and wait for the result.
  const data = await libraryApiSearch(authToken, parameters);

  returnPhotos(res, userId, data, parameters)
});

// Returns all albums owned by the user.
router.get('/getAlbums', async (req, res) => {
  redirectUnlessAuthenticated(req, res);
  router.logger.info('Loading albums');
  const userId = req.user.profile.id;

  // Attempt to load the albums from cache if available.
  // Temporarily caching the albums makes the app more responsive.
  const cachedAlbums = await albumCache.getItem(userId);
  if (cachedAlbums) {
    router.logger.verbose('Loaded albums from cache.');
    res.status(200).send(cachedAlbums);
  } else {
    router.logger.verbose('Loading albums from API.');
    // Albums not in cache, retrieve the albums from the Library API
    // and return them
    const data = await libraryApiGetAlbums(req.user.token);
    if (data.error) {
      // Error occured during the request. Albums could not be loaded.
      returnError(res, data);
      // Clear the cached albums.
      albumCache.removeItem(userId);
    } else {
      // Albums were successfully loaded from the API. Cache them
      // temporarily to speed up the next request and return them.
      // The cache implementation automatically clears the data when the TTL is
      // reached.
      res.status(200).send(data);
      albumCache.setItem(userId, data);
    }
  }
});

// Clear the cached albums owned by the user.
router.get('/albumCacheReset', async (req, res) => {
  redirectUnlessAuthenticated(req, res);
  router.logger.info('albumCacheReset');
  const userId = req.user.profile.id;
  albumCache.removeItem(userId);
  res.redirect('/album-details');
});

// Reauthenticate with google then go to page specified.
router.get('/reauth/:page', async (req, res) => {
  redirectUnlessAuthenticated(req, res);
  router.logger.info('reauth then going to page: '+req.params.page);
  // check req.isAuthenticated() ??
  req.session.lastPage = req.params.page
  res.redirect('/auth/google');
});


// Temporarily cache a list of the albums owned by the user. This caches
// the name and base Url of the cover image. This ensures that the app
// is responsive when the user picks an album.
// Loading a full list of the albums owned by the user may take multiple
// requests. Caching this temporarily allows the user to go back to the
// album selection screen without having to wait for the requests to
// complete every time.
// Note that this data is only cached temporarily as per the 'best practices' in
// the developer documentation. Here it expires after 10 minutes.
const albumCache = persist.create({
  dir: 'persist-albumcache/',
  ttl: 3300000,  // 55 minutes
});
albumCache.init();

// For each user, the app stores the last search parameters or album
// they loaded into the photo frame. The next time they log in
// (or when the cached data expires), this search is resubmitted.
// This keeps the data fresh. Instead of storing the search parameters,
// we could also store a list of the media item ids and refresh them,
// but resubmitting the search query ensures that the photo frame displays
// any new images that match the search criteria (or that have been added
// to an album).
const storage = persist.create({dir: 'persist-storage/'});
storage.init();


// Submits a search request to the Google Photos Library API for the given
// parameters. The authToken is used to authenticate requests for the API.
// The minimum number of expected results is configured in config.photosToLoad.
// This function makes multiple calls to the API to load at least as many photos
// as requested. This may result in more items being listed in the response than
// originally requested.
async function libraryApiSearch(authToken, parameters) {
  let photos = [];
  let nextPageToken = null;
  let error = null;

  parameters.pageSize = config.searchPageSize;

  try {
    // Loop while the number of photos threshold has not been met yet
    // and while there is a nextPageToken to load more items.
    do {
      router.logger.info(
          `Submitting search with parameters: ${JSON.stringify(parameters)}`);

      // Make a POST request to search the library or album
      const searchResponse =
      // await reTryCatch401((err) => {
        await fetch(config.apiEndpoint + '/v1/mediaItems:search', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
          },
          body: JSON.stringify(parameters)
        });
      // });

      if (searchResponse.status == 401) {
        router.logger.silly(JSON.stringify(searchResponse));
        searchResponseJson = await searchResponse.json();
        router.logger.silly(searchResponseJson);
        // chad todo: passport.authenticate and then retry fetch
      }
      router.logger.debug(`Before checkStatus`);
      const result = await checkStatus(searchResponse);
      router.logger.debug(`After checkStatus`);

      router.logger.debug(`Response: ${result}`);
      //router.logger.silly(JSON.stringify(result));

      // The list of media items returned may be sparse and contain missing
      // elements. Remove all invalid elements.
      // Also remove all elements that are not images by checking its mime type.
      // Media type filters can't be applied if an album is loaded, so an extra
      // filter step is required here to ensure that only images are returned.
      const items = result && result.mediaItems ?
          result.mediaItems
              .filter(x => x)  // Filter empty or invalid items.
              // Only keep media items with an image mime type.
              .filter(x => x.mimeType && x.mimeType.startsWith('image/')) :
          [];

      photos = photos.concat(items);

      // Set the pageToken for the next request.
      parameters.pageToken = result.nextPageToken;

      router.logger.verbose(
          `Found ${items.length} images in this request. Total images: ${
              photos.length}`);

      // Loop until the required number of photos has been loaded or until there
      // are no more photos, ie. there is no pageToken.
    } while (photos.length < config.photosToLoad &&
             parameters.pageToken != null);

  } catch (err) {
    // Log the error and prepare to return it.
    error = err;
    router.logger.error(JSON.stringify({'libraryApiSearch Error':err}));
  }

  router.logger.info('Search complete.');
  return {photos, parameters, error};
}

// Returns a list of all albums owner by the logged in user from the Library
// API.
async function libraryApiGetAlbums(authToken) {
  let albums = [];
  let nextPageToken = null;
  let error = null;

  let parameters = new URLSearchParams();
  parameters.append('pageSize', config.albumPageSize);
  router.logger.verbose('Using API cmd: /v1/albums?' + parameters);

  try {
    // Loop while there is a nextpageToken property in the response until all
    // albums have been listed.
    do {
      router.logger.verbose(`Loading albums. Received so far: ${albums.length}`);
      // Make a GET request to load the albums with optional parameters (the
      // pageToken if set).
      const albumResponse = await fetch(config.apiEndpoint + '/v1/albums?' + parameters, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
      });

      const result = await checkStatus(albumResponse);

      router.logger.debug(`Response: ${result}`);

      if (result && result.albums) {
        router.logger.verbose(`Number of albums received: ${result.albums.length}`);
        // Parse albums and add them to the list, skipping empty entries.
        const items = result.albums.filter(x => !!x);

        albums = albums.concat(items);
      }
    if(result.nextPageToken){
      parameters.set('pageToken', result.nextPageToken);
    }else{
      parameters.delete('pageToken');
    }
      
      // Loop until all albums have been listed and no new nextPageToken is
      // returned.
    } while (parameters.has('pageToken'));

  } catch (err) {
    // Log the error and prepare to return it.
    error = err;
    router.logger.error(JSON.stringify({'libraryApiGetAlbums Error':err}));
  }

  router.logger.silly(JSON.stringify({'API response of first album':albums[0]}));
  router.logger.info('Albums loaded.');
  return {albums, error};
}


// Chad TODO - make this more generic to hadle 401, 429, 5xx errors
// https://developers.google.com/photos/library/guides/best-practices
async function reTryCatch401(callback, times = 1) {
  try {
    return await callback()
  } catch (err) {
    if (times > 0) {
      if (err.status == 401 && err.serverMessage && err.serverMessage.error
          && err.serverMessage.error.status == "UNAUTHENTICATED") {
        // {"libraryApiSearch Error":{"status":401,"statusTitle":"Unauthorized","serverMessage":{"error":{"code":401,"message":"Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.","status":"UNAUTHENTICATED"}}}}
        router.logger.debug('Google says UNAUTHENTICATED, will try to authenticate again');
        passport.authenticate('google', {
          scope: config.scopes,
          failureFlash: true,  // Display errors to the user.
          session: true,
        });
      }
      return await reTryCatch401(callback, times - 1)
    } else {
      throw err
    }
  }
}


// Renders the given page if the user is authenticated.
// Otherwise, redirects to "/".
function renderIfAuthenticated(req, res, page) {
  if (!req.user || !req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render(page);
  }
}

// Prevent node app from crashing when user is no longer authenticatedd
function redirectUnlessAuthenticated(req, res) {
  if (!req.user || !req.isAuthenticated()) {
    res.redirect('/');
  }
}


// Responds with an error status code and the encapsulated data.error.
function returnError(res, data) {
  // Return the same status code that was returned in the error or use 500
  // otherwise.
  const statusCode = data.error.status || 500;
  // Return the error.
  res.status(statusCode).send(JSON.stringify(data.error));
}


// Return the body as JSON if the request was successful, or thrown a StatusError.
async function checkStatus(response){
  if (!response.ok){
    router.logger.debug('checkStatus - not ok');
    // Throw a StatusError if a non-OK HTTP status was returned.
    let message = "";
    try{
          // Try to parse the response body as JSON, in case the server returned a useful response.
        message = await response.json();
    } catch( err ){
      // Ignore if no JSON payload was retrieved and use the status text instead.
    }
    throw new StatusError(response.status, response.statusText, message);
  }
  router.logger.debug('checkStatus - ok');

  // If the HTTP status is OK, return the body as JSON.
  return await response.json();
}


// Custom error that contains a status, title and a server message.
class StatusError extends Error {
  constructor(status, title, serverMessage, ...params) {
    super(...params)
    this.status = status;
    this.statusTitle = title;
    this.serverMessage= serverMessage;
  }
}

export default router
