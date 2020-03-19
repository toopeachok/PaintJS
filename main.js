// Start menu and start button
document.getElementById("start-button").onclick = function () {
  document.getElementById("start-menu").style.display = "none";
}

//Menu buttons
var saveButton = document.getElementById("save-button");
var openButton = document.getElementById("open-button");

saveButton.onclick = function() {
  saveButton.href = mainCanvas.toDataURL();
  saveButton.download = "mypainting.png";
}

function draw() {
    img = new Image(),
    f = document.getElementById("uploadimage").files[0],
    url = window.URL || window.webkitURL,
    src = url.createObjectURL(f);

    img.src = src;
    img.onload = function() {
        bufferContext.drawImage(img, 0, 0);
        url.revokeObjectURL(src);
    }
}

document.getElementById("uploadimage").addEventListener("change", draw, false)

//Color picker
var colorPicker = document.getElementById("color-picker");
var colorPickerWrapper = document.getElementById("color-picker-wrapper");
var lineColor = "#000000";

colorPicker.onchange = function() {
  lineColor = "" + colorPicker.value;
  colorPickerWrapper.style.backgroundColor = lineColor;
}

//Line thickness
var lineThickness = 1;
var lineThicknessInput = document.getElementById("line-thickness");
lineThicknessInput.onchange = function () {
  lineThickness = lineThicknessInput.value;
}

//Draw type
var drawType = "line";
var lineInput = document.getElementById("line");
lineInput.onclick = function() {
  drawType = "line";
  document.getElementById("active-line").style.opacity = 1;
  document.getElementById("active-fillRectangle").style.opacity = 0;
  document.getElementById("active-strokeRectangle").style.opacity = 0;
  document.getElementById("active-strokeCircle").style.opacity = 0;
  document.getElementById("active-strokeStar").style.opacity = 0;
}

var fillRecInput = document.getElementById("fillRectangle");
fillRecInput.onclick = function() {
  drawType = "fillRectangle";
  document.getElementById("active-line").style.opacity = 0;
  document.getElementById("active-fillRectangle").style.opacity = 1;
  document.getElementById("active-strokeRectangle").style.opacity = 0;
  document.getElementById("active-strokeCircle").style.opacity = 0;
  document.getElementById("active-strokeStar").style.opacity = 0;
}

var strokeRecInput = document.getElementById("strokeRectangle");
strokeRecInput.onclick = function() {
  drawType = "strokeRectangle";
  document.getElementById("active-line").style.opacity = 0;
  document.getElementById("active-fillRectangle").style.opacity = 0;
  document.getElementById("active-strokeRectangle").style.opacity = 1;
  document.getElementById("active-strokeCircle").style.opacity = 0;
  document.getElementById("active-strokeStar").style.opacity = 0;
}

var strokeRecInput = document.getElementById("strokeCircle");
strokeRecInput.onclick = function() {
  drawType = "strokeCircle";
  document.getElementById("active-line").style.opacity = 0;
  document.getElementById("active-fillRectangle").style.opacity = 0;
  document.getElementById("active-strokeRectangle").style.opacity = 0;
  document.getElementById("active-strokeCircle").style.opacity = 1;
  document.getElementById("active-strokeStar").style.opacity = 0;
}

var strokeRecInput = document.getElementById("strokeStar");
strokeRecInput.onclick = function() {
  drawType = "strokeStar";
  document.getElementById("active-line").style.opacity = 0;
  document.getElementById("active-fillRectangle").style.opacity = 0;
  document.getElementById("active-strokeRectangle").style.opacity = 0;
  document.getElementById("active-strokeCircle").style.opacity = 0;
  document.getElementById("active-strokeStar").style.opacity = 1;
}

//Canvas
var mainCanvas = document.getElementById("canvas-main");
var bufferCanvas = document.getElementById("canvas-buffer");

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

  var clearRectInput = document.getElementById("clearRectangle");
  clearRectInput.onclick = function() {
    mainContext.clearRect(0, 0, 1200, 600);
    bufferContext.clearRect(0, 0, 1200, 600);
  }
}

