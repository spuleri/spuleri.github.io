window.onload = function() {
  // Build the gutter
  buildGutter();

  // sync scrolling
  syncScrolling();


  // Setup word wrap catching
  // create invisible div

  // Get the text area and assign listenrer
  var textarea = document.getElementById("editor-textarea");
  if (textarea) {
    textarea.oninput = updateGutter;

  } else {
    console.log("couldnt find text area");
  }
}

// Global Gutter Representation
// An array to represent the gutter.
// x (a number > 0) means a line number must be placed, 0 means a blank block is placed
var GutterRepresentation = [];

function syncScrolling() {
  var textarea = document.getElementById('editor-textarea');
  var gutter = document.getElementById('gutter');

  textarea.onscroll = function() {
      gutter.scrollTop = this.scrollTop;
  }
}

function updateGutter(event) {
  clearGutter();
  calculateLines(event.target);
  renderGutter();

  // Resync the scrolls
  var textarea = document.getElementById('editor-textarea');
  var gutter = document.getElementById('gutter');
  gutter.scrollTop = textarea.scrollTop;
}

function clearGutter() {
  GutterRepresentation = [];
  var gutter = document.getElementById("gutter");
  while (gutter.firstChild) {
    gutter.removeChild(gutter.firstChild);
  }
}

function renderGutter() {
  // Rerender/Update the gutter
  count = GutterRepresentation.length;
  var i = 0;
  while (i < count) {
    var v = GutterRepresentation[i];
    if (v == 0) {
      addInvisibleLineNumber();
    } else {
      addLineNumber(v);
    }
    i+=1;
  }
}

function addLineNumber(number) {

  // create the div
  var div = createLineNumDiv(number);

  // Add it to the gutter
  div.innerHTML = number;
  document.getElementById("gutter").appendChild(div);
}

// For when softwrapping occurs
function addInvisibleLineNumber() {
  var div = createLineNumDiv();
  div.innerHTML = "·";
  document.getElementById("gutter").appendChild(div);
}

// Creates a div that will hold line number, or empty space in the gutter.
function createLineNumDiv(number) {
  // Create the dive and give it the class.
  var div = document.createElement('div');
  div.className = 'line-row';
  // div.id = 'block' + number;

  // Get height of a line in the textarea and font size
  var textarea = document.getElementById("editor-textarea");
  var lh = window.getComputedStyle(textarea, null).getPropertyValue('line-height');
  var fs = window.getComputedStyle(textarea, null).getPropertyValue('font-size');
  div.style.fontSize = fs-2 + 'px';
  h = lh-2 + 'px';
  div.style.height = h;

  return div;
}

function removeLineNumber() {

}

// Calculate lines on every text area change
function calculateLines(textarea) {
  var lines = textarea.value.split(/\r*\n/);

  // Go through each "line" of text and count how many wrapping lines there are.
  // By comparing the length of the line to the width of the textarea
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    GutterRepresentation.push(i+1);

    var physicalLines = actualLineCount(line);
    var numberOfEmptyBlocksNecessary = physicalLines - 1;

    // Add the empty blocks
    var j = 0;
    while (j < numberOfEmptyBlocksNecessary) {
      GutterRepresentation.push(0);
      j+=1;
    }
  }
}

function buildGutter() {
  // Build gutter next to the text area with same height
  var textarea = document.getElementById("editor-textarea");

  // Set the height
  var gutter = document.getElementById("gutter");
  gutter.style.height = textarea.clientHeight + 'px';

  // Set gutter data
  calculateLines(textarea);
  renderGutter();

}


// Calculate how many logical lines this "line" of text takes up
// by comparing the width of the line to the width of the textarea.
function  actualLineCount(line) {
  var textarea = document.getElementById("editor-textarea");
  var span = document.createElement('span');


  // Get all the attributes of the text area and copy them to the span
  var lh = window.getComputedStyle(textarea, null).getPropertyValue('line-height');
  var fs = window.getComputedStyle(textarea, null).getPropertyValue('font-size');
  var ff = window.getComputedStyle(textarea, null).getPropertyValue('font-family');
  var textAreaWidth = textarea.getBoundingClientRect().width;
  // var w = 'auto';
  // span.style.width = w;
  span.style.lineHeight = lh;
  span.style.fontSize = fs;
  span.style.fontFamily = ff;
  span.style.hidden = 'true';


  // Set the text and add to DOM
  span.innerHTML = line;
  document.body.appendChild(span);

  // Get the width of the line
  // Great function to use: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  var lineWidth = span.getBoundingClientRect().width;

  // claculate lines this text takes
  var lc = lineWidth / textAreaWidth;

  // Delete this span from the document

  span.remove();
  // console.log('width of line is: ' + lineWidth + ' , and it takes up ' + lc + ' lines');

  return lc;

}


// https://stackoverflow.com/questions/17650776/add-remove-html-inside-div-using-javascript
