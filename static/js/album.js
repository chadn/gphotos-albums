/* MIT License
 * 
 * Copyright (c) 2024 Chad Norwood
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Notifies the backend to load an album into the photo frame queue.
// If the request is successful, the photo frame queue is opened,
// otherwise an error message is shown.
function loadFromAlbum(name, id) {
  showLoadingDialog();
  // Make an ajax request to the backend to load from an album.
  $.ajax({
    type: 'POST',
    url: '/loadFromAlbum',
    dataType: 'json',
    data: {albumId: id},
    success: (data) => {
      console.log('Albums imported:' + JSON.stringify(data.parameters));
      if (data.photos && data.photos.length) {
        // Photos were loaded from the album, open the photo frame preview
        // queue.
        window.location = '/';
      } else {
        // No photos were loaded. Display an error.
        handleError('Couldn\'t import album', 'Album is empty.');
      }
      hideLoadingDialog();
    },
    error: (data) => {
      handleError('Couldn\'t import album', data);
    }
  });
}

// Loads a list of all albums owned by the logged in user from the backend.
// The backend returns a list of albums from the Library API that is rendered
// here in a list with a cover image, title and a link to open it in Google
// Photos.
function listAlbums() {
  hideError();
  showLoadingDialog();
  $('#albums').empty();

  $.ajax({
    type: 'GET',
    url: '/getAlbums',
    dataType: 'json',
    success: (data) => {
      console.log('Loaded albums: ' + data.albums);
      // Render each album from the backend in its own row, consisting of
      // title, cover image, number of items, link to Google Photos and a
      // button to add it to the photo frame.
      // The items rendered here are albums that are returned from the
      // Library API.
      $.each(data.albums, (i, item) => {
        // Load the cover photo as a 100x100px thumbnail.
        // It is a base url, so the height and width parameter must be appened.
        const thumbnailUrl = `${item.coverPhotoBaseUrl}=w100-h100`;

        // Set up a Material Design Lite list.
        const materialDesignLiteList =
            $('<li />').addClass('mdl-list__item mdl-list__item--two-line');

        // Create the primary content for this list item.
        const primaryContentRoot =
            $('<div />').addClass('mdl-list__item-primary-content');
        materialDesignLiteList.append(primaryContentRoot);

        // The image showing the album thumbnail.
        const primaryContentImage = $('<img />')
                                        .attr('src', thumbnailUrl)
                                        .attr('alt', item.title)
                                        .addClass('mdl-list__item-avatar');
        primaryContentRoot.append(primaryContentImage);

        // The title of the album as the primary title of this item.
        const primaryContentTitle = $('<div />').text(item.title);
        primaryContentRoot.append(primaryContentTitle);

        // The number of items in this album as the sub title.
        const primaryContentSubTitle =
            $('<div />')
                .text(`(${item.mediaItemsCount} items)`)
                .addClass('mdl-list__item-sub-title');
        primaryContentRoot.append(primaryContentSubTitle);

        // Secondary content consists of two links with buttons.
        const secondaryContentRoot =
            $('<div />').addClass('mdl-list__item-secondary-action');
        materialDesignLiteList.append(secondaryContentRoot);


        // The 'add to photo frame' link.
        const linkToAddToPhotoFrame = $('<a />')
                                          .addClass('album-title')
                                          .attr('data-id', item.id)
                                          .attr('data-title', item.title);
        secondaryContentRoot.append(linkToAddToPhotoFrame);


        // The button for the 'add to photo frame' link.
        const addToPhotoFrameButton =
            $('<button />')
                .addClass(
                    'mdl-button mdl-js-button mdl-button--raised mdl-button--accent')
                .text('Add to frame');
        linkToAddToPhotoFrame.append(addToPhotoFrameButton);

        // The 'open in Google Photos' link.
        const linkToGooglePhotos =
            $('<a />').attr('target', '_blank').attr('href', item.productUrl);
        secondaryContentRoot.append(linkToGooglePhotos);

        // The button for the 'open in Google Photos' link.
        const googlePhotosButton = $('<button />')
                                       .addClass('gp-button raised')
                                       .text('Open in Google Photos');
        linkToGooglePhotos.append(googlePhotosButton);

        // Add the list item to the list of albums.
        $('#albums').append(materialDesignLiteList);
      });

      hideLoadingDialog();
      console.log('Albums loaded.');
    },
    error: (data) => {
      hideLoadingDialog();
      handleError('Couldn\'t load albums', data);
    }
  });
}

$(document).ready(() => {
  // Load the list of albums from the backend when the page is ready.
  listAlbums();

  // Clicking the 'add to frame' button starts an import request.
  $('#albums').on('click', '.album-title', (event) => {
    const target = $(event.currentTarget);
    const albumId = target.attr('data-id');
    const albumTitle = target.attr('data-title');

    console.log('Importing album: ' + albumTitle);

    loadFromAlbum(albumTitle, albumId);
  });
});
