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

// Loads a list of all albums owned by the logged in user from the backend.
// The backend returns a list of albums from the Library API that is
// prepared here for the sortable table.
function getAlbumData(cb) {
  $.ajax({
    type: 'GET',
    url: '/api/getAlbums',
    dataType: 'json',
    success: (data) => {
      //console.log('Loaded albums: ' + data.albums);
      data.totalMediaItemsCount = 0;
      data.sharedAlbums = false;
      $.each(data.albums, (i, item) => {
        item.number = i + 1;
        item.idShort = item.id.substr(0, 11);
        item.titleUrl = '<a target="_blank" rel="noopener noreferrer" ';
        item.titleUrl += `title="photos.google.com/album ${item.title}" `;
        item.titleUrl += `href="${item.productUrl}">${item.title}</a>`;
        data.totalMediaItemsCount += parseInt(item.mediaItemsCount);
        if (item.shareInfo) {
          data.sharedAlbums = true;
          item.shared = 'Yes';
        } else {
          item.shared = 'No';
        }
      });
      hideLoadingDialog();
      console.log('Albums loaded.');
      if (typeof cb == 'function') {
        cb(data);
      }
    },
    error: (data) => {
      hideLoadingDialog();
      handleError("Couldn't load albums", data);
    },
  });
}

function initHandsomeTable(albumData) {
  const container = document.querySelector('#album-details');

  let cols = [
    // { type: 'text', data: 'id',  title: 'album ID' },
    { data: 'number', title: 'Original<br>Order', type: 'numeric', width: 70 },
    {
      data: 'mediaItemsCount',
      title: 'Number<br>of Items',
      type: 'numeric',
      width: 80,
    },
    //{data: 'shared', title: "Shared", width: 60},
    //{data: 'idShort', title: "Album ID<br>(first 12)", width: 110},
    //{data: 'title',  title: "Album Title"},
    { data: 'titleUrl', title: 'Album Title', renderer: 'html' },
  ];
  const hot = new Handsontable(container, {
    data: albumData,
    readOnly: true,
    columns: cols,
    stretchH: 'last', // stretch last column, other columns should specify width.
    columnSorting: true,
    colHeaders: true,
    height: 'auto',
    autoWrapRow: true,
    autoWrapCol: true,
    licenseKey: 'non-commercial-and-evaluation',
  });
  return hot;
}

$(document).ready(async () => {
  if (window.handsontableJsLoaded) {
    console.log('jquery document ready, handsontableJsLoaded');
  } else {
    console.log('jquery document ready, waiting on handsontableJsLoaded');
    await sleep(500); // Wait for 0.5 seconds
  }
  let albumData = [
    {
      number: 0,
      titleUrl: 'FETCHING ALBUMS .... (takes 5-20 seconds)',
      mediaItemsCount: '0',
    },
  ];

  hideError();
  showLoadingDialog();

  // TODO: Consider switching from HandsomeTable to Material design
  // https://m2.material.io/components/data-tables/web#data-tables

  window.hot = initHandsomeTable(albumData);
  getAlbumData((data) => {
    console.log(
      `getAlbumData() returned ${data.totalMediaItemsCount} total items.`
    );
    window.hot.updateData(data.albums);
    //console.log('hot.updateData()', JSON.stringify(data.albums));
    //window.hot.render();
    $('#total-num-items').text(data.totalMediaItemsCount);
  });
});
