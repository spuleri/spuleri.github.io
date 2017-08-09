// Runs the js once turbolinks has loaded the page
// see: https://github.com/turbolinks/turbolinks#running-javascript-when-a-page-loads
document.addEventListener("turbolinks:load", function() {
  // Grab the textarea and load the CodeMirror editor from it
  var textarea = document.getElementById("editor-textarea");
  if (textarea) {
    buildEditor(textarea);
    console.log("Created a codemirror")
  }

});

// Builds the CodeMirror text editor
function buildEditor(textarea) {
  // Options for the editor
  var opts = {
    'lineWrapping': true,
    'lineNumbers': true,
    'theme': 'github-light',
    'mode': 'gfm'
  };

  var myCodeMirror = CodeMirror.fromTextArea(textarea, opts);

  // Get buttons and add actions
  var editButton = document.getElementById("edit-button");
  var previewButton = document.getElementById("preview-button");
  var preview = document.getElementById("preview-wrapper");

  // On click actions for the edit button
  editButton.onclick = function() {
    editButton.classList.add('selected');
    previewButton.classList.remove('selected');

    // Hide the preview and show the editor
    preview.innerHTML = '';
    myCodeMirror.getWrapperElement().style.display = 'block';
  };

  // On click actions for the preview button
  previewButton.onclick = function() {
    previewButton.classList.add('selected');
    editButton.classList.remove('selected');

    // Load the markdown preview html and hide codemirror
    markdownPreview(myCodeMirror.getValue());
    myCodeMirror.getWrapperElement().style.display = 'none';
  };
}

function showLoading() {
  var preview = document.getElementById("preview-wrapper");
  preview.innerHTML = "<p><b>Loading preview...</b></p>";
}

function handlePreviewResponse() {
  var previewHTML = this.response;
  var preview = document.getElementById("preview-wrapper");
  preview.innerHTML = '';
  preview.innerHTML = previewHTML.compiledHTML;

};

function markdownPreview(content) {
  // Show loading
  showLoading();
  // Build and send the ajax request
  var request = new XMLHttpRequest();
  request.onload = handlePreviewResponse;
  request.open("post", window.location.origin + "/markdown_preview");
  request.setRequestHeader("Content-Type", "application/json");
  request.responseType = 'json';
  var payload = JSON.stringify({"content": content});
  request.send(payload);
}
