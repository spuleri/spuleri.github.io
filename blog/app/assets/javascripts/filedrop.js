document.addEventListener("turbolinks:load", () => {
  // Get the dropzone div and configure it with the callback
  // to be called upon file selections.
  const dropzone = document.getElementById('dropzone');
  if (dropzone) {
    initializeDropzone(dropzone, handleFilesDropped);
  }
});

// Class to represent a File that is associated with this post
// mainly used to maintain state about a file and its whether or not
// it has been uplaoded to the cloud
class PostImage {
  constructor(file, cloudURL) {
    this.file = file;
    this.cloudURL = cloudURL || '';
    this.name = file.name;
    this.DOMNode = null;
    this.statusTextNode = null;
  }

  getImageUrl() {
    if (!this.cloudURL) {
      return URL.createObjectURL(this.file);
    } else {
      return this.cloudURL;
    }
  }

  setDOMNode(node) {
    this.DOMNode = node;
  }

  setStatusTextNode(node) {
    this.statusTextNode = node;
  }
}

const FileManager = {
  // Maintains the state of files dropped on the page
  filesDropped: [],

  // Called when a file is dropped
  // to add it to the thumbnails
  dropFile: function(postImage) {
    this.filesDropped.push(postImage);
    var idx = this.filesDropped.length - 1;

    // Create and add the thumbnail node
    var tn = document.getElementById('thumbnails');
    const node = constructThumbnailNode(postImage, idx, postImage.name, tn);
    postImage.setDOMNode(node);
    uploadFile(postImage);
  },

  // Function called when a file is removed
  removeFile: function(file, thumb) {
    // Remove from data source
    this.filesDropped = this.filesDropped.filter(f => f.name !== file.name);
    var tn = document.getElementById('thumbnails').removeChild(thumb);

    if (!this.filesDropped.length) {
      configureEmptyDropzone();
    }
  }
}

function handleFilesDropped(files) {
  // Here, we simply log the Array of files to the console.
  console.log(files);

  // Configure the dropzone
  configureDropzoneWhenFilesArePresent();

  for (var i = 0; i < files.length; i++) {
    FileManager.dropFile(new PostImage(files[i]));
  }
}

function constructThumbnailNode(postImage, idx, title, tn) {
  const localImageUrl = postImage.getImageUrl();

  var container = document.createElement('div');
  container.id = 'thumb-' + idx;
  // Create delete button
  var deleteButton = document.createElement('a');
  deleteButton.innerHTML = "<i class=\"fa fa-times fa-2x\" aria-hidden=\"true\"></i>";
  deleteButton.className = 'delete tooltip';
  // Create tooltip node and add it
  const deleteToolTipNode = document.createElement('span');
  deleteToolTipNode.className = 'tooltiptext';
  deleteToolTipNode.textContent = 'Delete from browser memory but not from S3';
  deleteButton.appendChild(deleteToolTipNode);

  deleteButton.onclick = (e) => {
    e.stopPropagation();
    FileManager.removeFile(postImage, container);
  };

  // Create copy to clipboard button
  var copyButton = document.createElement('a');
  copyButton.className = 'copy tooltip';

  // Add the icon to the copy button
  copyButton.innerHTML = "<i class=\"fa fa-clipboard fa-lg\" aria-hidden=\"true\"></i>";

  // Create the tooltip node and add it
  const toolTipNode = document.createElement('span');
  toolTipNode.className = 'tooltiptext';
  toolTipNode.textContent = 'Copy to clipboard';
  copyButton.appendChild(toolTipNode);

  // Add the click event handler to copy the text
  copyButton.onclick = (e) => {
    e.stopPropagation();
    copyTextToClipboard(postImage.getImageUrl(), toolTipNode);
  };

  // Reset the text upon mouseleave
  copyButton.addEventListener("mouseleave", (e) => {
    toolTipNode.textContent = 'Copy to clipboard'
  });

  var img = new Image();
  img.src = localImageUrl;
  img.className = 'thumbnail';
  var filename = title;
  img.alt = filename;
  container.appendChild(img);
  container.appendChild(deleteButton);
  container.appendChild(copyButton);
  var caption = document.createElement('figcaption');
  caption.className = 'caption';
  caption.textContent = filename;
  container.appendChild(caption);
  tn.appendChild(container);
  return container;
}


function initializeDropzone(element, callback) {
  // Grab the default file input and hide it
  var input = document.getElementById('post_images');
  input.style.display = 'none';

  // Add event listeners for change
  input.addEventListener('change', triggerCallback);
  element.appendChild(input);

  // Add event listener for dragover
  element.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    element.classList.add('dragover');
    e.dataTransfer.dropEffect= 'copy';
  });

  // Add event listener for leaving the drag zone
  // we want to remove dragover styling
  element.addEventListener('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    element.classList.remove('dragover');
  });

  // Add listener for drop event - will trigger the callback
  element.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    element.classList.remove('dragover');
    triggerCallback(e);
  });

  // Add listener for click - will trigger default file input click
  // Which will then trigger the callback with the first onchange event we set
  element.addEventListener('click', clickDropZoneEvent);

  function triggerCallback(e) {
    var files;
    if(e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if(e.target) {
      files = e.target.files;
    }
    callback.call(null, files);
  }
}

function configureEmptyDropzone() {
  // Show the initial info text
  var infoText = document.getElementById('upload-info');
  infoText.style.display = 'block';

  // Add back the click event handler
  const dropzone = document.getElementById('dropzone');
  dropzone.addEventListener('click',  clickDropZoneEvent);

  dropzone.classList.remove('has-files');
}

// Function called to configure the area for when files are present
function configureDropzoneWhenFilesArePresent() {
  // Hide the initial info text
  var infoText = document.getElementById('upload-info');
  infoText.style.display = 'none';

  // Just remove the click event handler
  const dropzone = document.getElementById('dropzone');
  dropzone.removeEventListener('click',  clickDropZoneEvent);

  dropzone.classList.add('has-files');
}

function clickDropZoneEvent() {
    const input = document.getElementById('post_images');
    input.value = null;
    input.click();
}

function copyTextToClipboard(text, toolTipNode) {
  const dummyInput = document.createElement('textarea');
  dummyInput.style.position = 'fixed';
  dummyInput.style.top = 0;
  dummyInput.style.left = 0;
  dummyInput.value = text;
  document.body.appendChild(dummyInput);
  dummyInput.select();
  try {
    var status = document.execCommand('copy');
    if(!status) {
      console.log("Cannot copy text");
      if (toolTipNode) {
        toolTipNode.textContent = 'Cannot copy text';
      }
    } else {
      console.log("URL copied to clipboard " + window.getSelection());
      if (toolTipNode) {
        toolTipNode.textContent = 'URL copied!';
      }
    }
    document.body.removeChild(dummyInput);
  } catch (err) {
      alert('Unable to copy.');
  }
}
