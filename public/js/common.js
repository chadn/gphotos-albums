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

// Displays the overlay loading dialog.
function showLoadingDialog() {
  $('.loading-dialog').show();
}

// Hides the overlay loading dialog.
function hideLoadingDialog() {
  $('.loading-dialog').hide();
}

// Shows an error with a title and a JSON object that is pretty printed.
function showJsonError(title, json) {
  showError(title, JSON.stringify(json, null, 2));
}

// Shows an error with a title and text. Scrolls the screen to show the error.
function showError(title, text) {
  // Hide the loading dialog, just in case it is still being displayed.
  hideLoadingDialog();

  $('#errorTitle').text(title);
  $('#errorMessage').text(text);
  $('#error').show();

  // Scroll to show the error message on screen.
  $('html,body').animate({scrollTop: $('#error').offset().top}, 300);
}

// Hides the error message.
function hideError() {
  $('#error').hide();
}

// Handles errors returned from the backend.
// Intended to be used as the error handler for ajax request to the backend.
// For authentication issues, the user is redirected to the log out screen.
// Otherwise, the error is shown to the user (and prettyprinted if possible).
function handleError(title, data) {
  console.log('Error: ' + JSON.stringify(data));

  if (data.status == 401) {
    // Authentication error. Redirect back to the log in screen.
    // chad todo - this working?
    window.location = '/logout';
  } else if (data.status == 0) {
    // Server could not be reached from the request.
    // It could be blocked, unavailable or unresponsive.
    showError(title, 'Server could not be reached. Please try again.');
  } else if (data.responseJSON) {
    // JSON error that can be formatted.
    showJsonError(title, data.responseJSON);
  } else {
    // Otherwise, display the data returned by the request.
    showError(title, data);
  }
  hideLoadingDialog();
}