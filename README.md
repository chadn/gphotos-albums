# GPhotos-Albums

## App Overview
This is a Node.js web application that simply lists album info from a user using [Google Photos API](https://developers.google.com/photos) and [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2).  

## Example Website

User will need to be logged in to Google, and give read permissions for samo.org on the first use.  User can do this at https://gphotos.samo.org/

## Background

As author of this code, I created this mainly to serve my own need of seeing all the names of my albums in one place.  I have many albums, and Web app and Mobile app do not make this easy.  

The code does use Google's OAuth 2.0, .

This app is based on [chadn/google-photos](https://github.com/chadn/google-photos), 
which is forked from from [googlesamples/google-photos](https://github.com/googlesamples/google-photos),
which is built using [Express.js](https://expressjs.com/) and [Material Design Lite](https://getmdl.io/).


## Set up
Before you can run this sample, you must set up a Google Developers project and configure authentication credentials. Follow the
[get started guide](https://developers.google.com/photos/library/guides/get-started) to complete these steps:
1. Set up a Google Developers Project and enable the **Google Photos Library API**.
1. In your project, set up new OAuth credentials for a web server application. Set the authorized JavaScript origin to `http://127.0.0.1` and the authorized redirect URL to `http://127.0.0.1:8080/auth/google/callback` if you are running the app locally.
1. The console will display your authentication credentials. Add the `Client ID` and `Client secret` to the file `config.js`, replacing the placeholder values:
```
// The OAuth client ID from the Google Developers console.
config.oAuthClientID = 'ADD YOUR CLIENT ID';

// The OAuth client secret from the Google Developers console.
config.oAuthclientSecret = 'ADD YOUR CLIENT SECRET';
```

You are now ready to run the sample:
1. Ensure [Node.JS](https://nodejs.org/) and [npm](https://www.npmjs.com/) are installed and available on your system. You need a recent Node.js version (v14 or later) to run this sample.
1. Install dependencies: Run `npm install`,
1. Start the app: Run `node app.js`.

By default, the app will listen on port `8080`. Open a web browser and navigate to [http://127.0.0.1:8080](http://127.0.0.1:8080) to access the app.

# Troubleshooting
Make sure that you have configured the `Client ID` and the `Client secret` in the configuration file `config.js`.
Also check that the URLs configured for these credentials match how you access the server. By default this is configured for 127.0.0.1 (localhost) on port 8080.

You can also start the app with additional debug logging by setting the `DEBUG` environment variable to `true`. For example:
```
DEBUG=TRUE node app.js
```

# API Use and code overview
The app is built using the [Express.js](https://expressjs.com/) framework and the [ejs](http://ejs.co/) templating system.

First, the user has to log in via OAuth 2.0 and authorize the `https://www.googleapis.com/auth/photoslibrary.readonly` scope. (See the file `config.js`.)
Once authenticated, photos are loaded into the photo frame via search or from an album.

The app is split into the backend (`app.js`) and the front end (`static/...`). The front end make AJAX requests to the backend. The backend returns album data directly from the Google Photos Library API that are parsed and rendered in the browser.
