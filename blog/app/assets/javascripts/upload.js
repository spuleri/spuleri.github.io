// Uploads the file cloud
function uploadFile(postImageObject) {
  // Show loading
  setLoadingStatusText(postImageObject);

  // Build and send the ajax request
  sendRequest(postImageObject);
}

function setLoadingStatusText(postImageObject) {
  const statusText = document.createElement('span');
  statusText.innerHTML = '<b>Status</b>: Uploading...';
  statusText.className = 'imageStatus';
  const domNode = postImageObject.DOMNode;
  domNode.appendChild(statusText);
  postImageObject.setStatusTextNode(statusText);
}

function sendRequest(postImageObject) {
   // Grab the dropzone div to get the pre signed post options
  // from the data params
  const dropzone = document.getElementById('dropzone');
  const parsedPresignedPostData = JSON.parse(dropzone.getAttribute('data-form-data'));
  const url = dropzone.getAttribute('data-url');

  // Build request
  const request = new XMLHttpRequest();
  request.onload = () => handleUploadResponse(postImageObject, request);
  request.onerror = () => handleUploadError(postImageObject.statusTextNode);
  request.upload.addEventListener('progress',
    (e) => handleUploadProgress(e, postImageObject.statusTextNode),
    false);
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
  formData.append('Content-Type', postImageObject.file.type);
  formData.append('file', postImageObject.file);

  // Send it
  request.responseType = 'document';
  const payload = formData;
  request.send(payload);

}

function handleUploadProgress(e, statusText) {
  let divisor =  e.total > 1000000 ? 1000000 : 1000;
  let unit =  e.total > 1000000 ? 'MB' : 'KB';
  const progressString = Math.round(((e.loaded/divisor)*10))/10
    + unit + ' \/ ' +
    Math.round(((e.total/divisor)*10))/10 + unit;
  statusText.innerHTML = '<b>Status</b>: Uploading... ' + progressString;
}

function handleUploadError(statusText, msg) {
  const errorStatus = '<b>Error uploading</b>: Check console';
  statusText.innerHTML = errorStatus;
  console.log("Error Uploading...");
  if (msg) {
    console.log(msg);
  }
}

function handleUploadResponse(postImageObject, xhr) {
  console.log('Got response from server...');
  const res = xhr.responseXML;

// Parse the xml resposne for the url of our uploaded image
  // Check for S3 error in response XML
  const error = res.getElementsByTagName("Error")[0]
  if (error) {
    // Grab the error message and handle
    const msg = res.getElementsByTagName("Message")[0].innerHTML;
    handleUploadError(postImageObject.statusTextNode, msg);
  } else {
    const imageURL = res.getElementsByTagName("Location")[0].innerHTML;
    postImageObject.cloudURL = imageURL;
    console.log('Image URL is:');
    console.log(imageURL);
    postImageObject.statusTextNode.innerHTML = '<b>Status</b>: Uploaded ✅ ';
  }
}
