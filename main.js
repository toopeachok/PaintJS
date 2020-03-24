// Start menu and start button
document.querySelector("#start-button").onclick = function () {
  document.querySelector("#start-menu").style.display = "none";
}

//Menu buttons
var saveButton = document.querySelector("#save-button");
var openButton = document.querySelector("#open-button");

saveButton.onclick = function() {
  saveButton.href = mainCanvas.toDataURL();
  saveButton.download = "mypainting.png";
}

function draw() {
    img = new Image(),
    f = document.querySelector("#uploadimage").files[0],
    url = window.URL || window.webkitURL,
    src = url.createObjectURL(f);

    img.src = src;
    img.onload = function() {
        bufferContext.drawImage(img, 0, 0);
        url.revokeObjectURL(src);
    }
}

document.querySelector("#uploadimage").addEventListener("change", draw, false)

//Color picker
var colorPicker = document.querySelector("#color-picker");
var colorPickerWrapper = document.querySelector("#color-picker-wrapper");
var lineColor = "#000000";

colorPicker.onchange = function() {
  lineColor = "" + colorPicker.value;
  colorPickerWrapper.style.backgroundColor = lineColor;
}

//Line thickness
var lineThickness = 1;
var lineThicknessInput = document.querySelector("#line-thickness");
lineThicknessInput.onchange = function () {
  lineThickness = lineThicknessInput.value;
}

//Draw type
var drawType = "line";
var drawTypeElements = document.querySelectorAll(".draw-type");
var drawTypeWrapper = document.querySelector(".draw-type-wrapper");
var lineDrawType = document.querySelector("#line");
drawTypeWrapper.onclick = function (event) {
  if (event.target !== lineDrawType) {
    lineDrawType.classList.remove("highlight-active-drawtype");
  }
  var target = event.target.closest('div');
  if (target.tagName != 'DIV') return;
  highlight(target);
}

var selectedImg;

function highlight(img) {
  if (selectedImg) {
    selectedImg.classList.remove('highlight-active-drawtype');
  }
  selectedImg = img;
  selectedImg.classList.add('highlight-active-drawtype');
}

for (var i = 0; i <= drawTypeElements.length - 2; i++) {
  drawTypeElements[i].onclick = changeDrawType;
}

function changeDrawType() {
  drawType = String(this.id);
}

//Canvas
var mainCanvas = document.querySelector("#canvas-main");
var bufferCanvas = document.querySelector("#canvas-buffer");

var x = 0;
var y = 0;

if (mainCanvas.getContext) {
  var isDrawing = false; // When true, moving the mouse draws on the canvas
  var mainContext = mainCanvas.getContext("2d");
  var bufferContext = bufferCanvas.getContext("2d");

  // Add the event listeners for mousedown, mousemove, and mouseup
  bufferCanvas.onmousedown = function(event) {
  x = event.offsetX;
  y = event.offsetY;
  isDrawing = true;
  mainContext.drawImage(bufferCanvas, 0, 0);
  
  bufferCanvas.onmousemove = function(event) {
    if (isDrawing === true) {
      if (drawType === "line") {
        drawLine(bufferContext, x, y, event.offsetX, event.offsetY, lineThickness, lineColor);
        x = event.offsetX;
        y = event.offsetY;
      }
    }

      if (drawType === "fillRectangle") {
        bufferContext.clearRect(0, 0, 1200, 600);
        drawFillRect(bufferContext, x, y, event.offsetX - x, event.offsetY - y, lineColor);
      }

      if (drawType === "strokeRectangle") {
        bufferContext.clearRect(0, 0, 1200, 600);
        drawStrokeRect(bufferContext, x, y, event.offsetX - x, event.offsetY - y, lineColor);
      }

      if (drawType === "strokeCircle") {
        bufferContext.clearRect(0, 0, 1200, 600);
        drawStrokeRCircle(bufferContext, x, y, event.offsetX - x, event.offsetY - y, lineColor);
      }

      if (drawType === "strokeStar") {
        bufferContext.clearRect(0, 0, 1200, 600);
        drawStrokeStar(bufferContext, x, y, event.offsetX - x, event.offsetY - y, lineColor);
      }
    }
  }

  bufferCanvas.onmouseup = function(event) {
    if (isDrawing === true) {
      if (drawType === "line") {
        drawLine(mainContext, x, y, event.offsetX, event.offsetY, lineThickness, lineColor);
      }
      mainContext.drawImage(bufferCanvas, 0, 0);
      x = 0;
      y = 0;
      isDrawing = false;
    }
    bufferCanvas.onmousemove = null;
  }
  
  function drawLine(context, x1, y1, x2, y2, lineThickness, lineColor) {
    context.beginPath();
    context.strokeStyle = lineColor;
    context.lineWidth = lineThickness;
    context.lineCap = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
  }

  function drawFillRect(context, x1, y1, widthRect, heightRect, color) {
    context.fillStyle = color;
    context.fillRect(x1, y1, widthRect, heightRect);
  }
  
  function drawStrokeRect(context, x1, y1, widthRect, heightRect, color) {
    context.strokeStyle = color;
    context.lineWidth = lineThickness;
    context.strokeRect(x1, y1, widthRect, heightRect);
  }

  function drawStrokeRCircle(context, x1, y1, x2, y2, color) {
    var radius = Math.sqrt( Math.pow(x2, 2) + Math.pow(y2, 2) );
    context.strokeStyle = color;
    context.lineWidth = lineThickness;
    context.beginPath();
    context.arc(x1, y1, radius, 0, 2 * Math.PI);
    context.stroke();
    context.closePath();
  }

  function drawStrokeStar(context, x1, y1, x2, y2, color) {
      var spikes = 5;
      var rot = Math.PI / 2 * 3;
      var x = x1;
      var y = y1;
      var step = Math.PI / spikes;
      var outerRadius = Math.sqrt( Math.pow(x2, 2) + Math.pow(y2, 2) );
      var innerRadius = outerRadius / 3;

      context.strokeSyle = "#000";
      context.beginPath();
      context.moveTo(x1, y1 - outerRadius)
      for (i = 0; i < spikes; i++) {
          x = x1 + Math.cos(rot) * outerRadius;
          y = y1 + Math.sin(rot) * outerRadius;
          context.lineTo(x, y)
          rot += step

          x = x1 + Math.cos(rot) * innerRadius;
          y = y1 + Math.sin(rot) * innerRadius;
          context.lineTo(x, y)
          rot += step
      }
      context.lineTo(x1, y1 - outerRadius)
      context.closePath();
      context.lineWidth = lineThickness;
      context.strokeStyle=color;
      context.stroke();
  }

  var clearRectInput = document.querySelector("#clearRectangle");
  clearRectInput.onclick = function() {
    mainContext.clearRect(0, 0, 1200, 600);
    bufferContext.clearRect(0, 0, 1200, 600);
  }
}

