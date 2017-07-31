// Runs the js once turbolinks has loaded the page
// see: https://github.com/turbolinks/turbolinks#running-javascript-when-a-page-loads
document.addEventListener("turbolinks:load", function() {
  // Grab the textarea and load the CodeMirror editor from it
  var textarea = document.getElementById("editor-textarea");
  if (textarea) {
    buildEditor(textarea);
    console.log("created a codemirror")
  } else {
    console.log("couldnt find text area");
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

  // On click to add clas upon selected
  editButton.onclick = function() {
    editButton.classList.add('selected');
    previewButton.classList.remove('selected');
  };

  previewButton.onclick = function() {
    previewButton.classList.add('selected');
    editButton.classList.remove('selected');
  };

}
