document.addEventListener("turbolinks:load", () => {
  // Get the dropzone div and configure it with the callback
  // to be called upon file selections.
  const dropzone = document.getElementById('dropzone');
  initializeDropzone(dropzone, handleFilesDropped);


  // Initialize file manager
  // this is necessary if we are editing a post
  // and it had images that were served from the server
  // TODO:
});

// Class to represent a File that is associated with this post
// mainly used to maintain state about a file and its whether or not
// it has been uplaoded to the cloud
class PostImage {
  constructor(file, cloudURL) {
    this.file = file;
    this.uploaded = false;
    this.cloudURL = cloudURL || '';
    this.name = file.name;
  }

  getImageUrl() {
    if (!this.cloudURL) {
      return URL.createObjectURL(this.file);
    } else {
      return this.cloudURL;
    }
  }

  // Maintain the dom node to easily update it / delete it
  setDOMNode(node) {
    this.DOMNode = node;
  }

  // Uploads the file to the server and cloud
  // TODO: Abstract this functionality OUT of this class...
  uploadFile() {
    // Show loading
    const statusText = document.createElement('span');
    statusText.innerHTML = '<b>Status</b>: Uploading...'
    statusText.className = 'imageStatus';
    this.DOMNode.appendChild(statusText);
    this.statusTextNode = statusText;

    // Grab the dropzone div to get the pre signed post options
    // from the data params
    const dropzone = document.getElementById('dropzone');
    const presignedPostData = dropzone.getAttribute('data-form-data');
    const parsedPresignedPostData = JSON.parse(presignedPostData);
    const url = dropzone.getAttribute('data-url');
    const host = dropzone.getAttribute('data-host');

    // Build and send the ajax request
    const request = new XMLHttpRequest();
    request.onload = () => this.handleUploadResponse(this, request);
    request.upload.addEventListener('progress', function(e) {
      let divisor =  e.total > 1000000 ? 1000000 : 1000
      let unit =  e.total > 1000000 ? 'MB' : 'KB'
      const progressString = Math.round(((e.loaded/divisor)*10))/10
        + unit + ' \/ ' +
        Math.round(((e.total/divisor)*10))/10 + unit;
      statusText.innerHTML = '<b>Status</b>: Uploading... ' + progressString;
    }, false);
    request.open("post", url);

    // Add image as FormData
    const formData = new FormData();

    // Append all the presigned post data attributes to the form object
    for (var prop in parsedPresignedPostData) {
      formData.append(prop, parsedPresignedPostData[prop]);
    }
    // Add content-type so aws knows what type of file this is.
    // This isnt required. But makes it so the file doesn't auto download
    // when the link is clicked, which is nice.
    formData.append('Content-Type', this.file.type)
    formData.append('file', this.file);

    // Send it
    request.responseType = 'document';
    const payload = formData;
    request.send(payload);
  }

  handleUploadResponse(postImageObject, xhr) {
    const res = xhr.responseXML;
    console.log('Got response from server...');

    // Parse the xml resposne for the url of our uploaded image
    const error = res.getElementsByTagName("Error")[0]
    if (error) {
      // Grab the error message
      const msg = res.getElementsByTagName("Message")[0].innerHTML;
      postImageObject.statusTextNode.innerHTML = '<b>Error uploading</b>: Check console';
      console.error(msg);
    } else {
      const imageURL = res.getElementsByTagName("Location")[0].innerHTML;
      postImageObject.cloudURL = imageURL;
      console.log('Image URL is:');
      console.log(imageURL);
      postImageObject.statusTextNode.innerHTML = '<b>Status</b>: Uploaded ✅ ';
    }

  }

}

const FileManager = {
  // Maintains the state of files dropped on the page
  filesDropped: [],

  // Maintains the state of files uploaded
  uploadQueue: [],

  // Called when a file is dropped
  // to add it to the thumbnails
  dropFile: function(postImage) {
    this.filesDropped.push(postImage);
    var idx = this.filesDropped.length - 1;
    // Add the thumbnail node
    var tn = document.getElementById('thumbnails');
    const node = constructThumbnailNode(postImage, idx, postImage.name, tn);
    postImage.setDOMNode(node);
    postImage.uploadFile();
    this.updateInputsValue();
  },

  // Function called when a file is removed
  removeFile: function(file, thumb) {
    // Remove from data source
    this.filesDropped = this.filesDropped.filter(f => f.name !== file.name);
    var tn = document.getElementById('thumbnails').removeChild(thumb);

    if (!this.filesDropped.length) {
      configureEmptyDropzone();
    }
    this.updateInputsValue();
  },

  updateInputsValue: function() {
    //var input = document.getElementById('post_images');
    //input.value = this.filesDropped;
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
  deleteButton.className = 'delete';
  deleteButton.onclick = (e) => {
    e.stopPropagation();
    FileManager.removeFile(postImage, container);
  };

  // Create copy to clipboard button
  var copyButton = document.createElement('a');
  copyButton.innerHTML = "<i class=\"fa fa-clipboard fa-lg\" aria-hidden=\"true\"></i>";
  copyButton.className = 'copy';
  copyButton.onclick = (e) => {
    e.stopPropagation();
    copyTextToClipboard(postImage.getImageUrl());
 };

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

function copyTextToClipboard(text) {
  const dummyInput = document.createElement('textarea');
  dummyInput.style.position = 'fixed';
  dummyInput.style.top = 0;
  dummyInput.style.left = 0;
  dummyInput.value = text;
  document.body.appendChild(dummyInput);
  dummyInput.select();
  try {
      var status = document.execCommand('copy');
      if(!status){
          console.log("Cannot copy text");
      }else{
          console.log("The text is now on the clipboard: " + window.getSelection());
      }
    document.body.removeChild(dummyInput);
  } catch (err) {
      alert('Unable to copy.');
  }
}
