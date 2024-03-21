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

// Submits a request to load images from a search with filters.
// The entire form is sent to the backend, where the options set here
// are converted into filters and parameters for a search request for the
// Library API.
function importFilter(filter) {
  $.ajax({
    type: 'POST',
    url: '/loadFromSearch',
    dataType: 'json',
    data: filter,
    success: (data) => {
      console.log('Loaded photos successfully.');
      if (data.photos && data.photos.length > 0) {
        // If the request was successful and images were loaded,
        // go back to the preview screen that shows the grid of images queued
        // for display.
        window.location = '/';
      } else {
        handleError('No images found', 'Try different search parameters.');
      }
      hideLoadingDialog();
    },
    error: (data) => {
      handleError('Couldn\'t load images.', data);
    },
  });
}

$(document).ready(() => {
  // Show date filter options based on which date filter type is selected.
  $('input[name$=\'dateFilter\']').on('click', (e) => {
    const range = '#rowDateRange';
    const exact = '#rowDateExact';

    switch ($(e.currentTarget).val()) {
      case 'none':
        $(range).hide();
        $(exact).hide();
        break;
      case 'exact':
        $(range).hide();
        $(exact).show();
        break;

      case 'range':
        $(range).show();
        $(exact).hide();
        break;
    }
  });

  // When the filter form is submitted, serialize its contents, show the loading
  // dialog and submit the request to the backend.
  $('#filter').on('submit', (e) => {
    e.preventDefault();
    showLoadingDialog();
    importFilter($('#filter').serialize())
  });
});