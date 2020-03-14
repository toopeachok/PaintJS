var startMenu = document.getElementById("start-menu");
var button = document.getElementById("start-button");

button.onclick = function () {
  startMenu.style.display = "none";
}

var canvas = document.getElementById("canvas");

if (canvas.getContext) {
  var isDrawing = false;  // When true, moving the mouse draws on the canvas
  var x = 0;
  var y = 0;
  var lineThickness = 1;
  var lineColor = "black";
  var context = canvas.getContext("2d");
  var rect = canvas.getBoundingClientRect();  // The x and y offset of the canvas from the edge of the page

  var pickedColorElement = document.getElementById("picked-color");

  var colorPickerElement = document.getElementById("color-picker");
  colorPickerElement.onchange = function () {
    lineColor = "" + colorPickerElement.value;
    pickedColorElement.style.backgroundColor = lineColor;
  }

  var lineThicknessInput = document.getElementById("line-thickness");
  lineThicknessInput.onchange = function () {
    lineThickness = lineThicknessInput.value;
  }

  var drawingType = "line";
  function checkDrawType() {
      var inp = document.getElementsByName('drawType');
      for (var i = 0; i < inp.length; i++) {
          if (inp[i].type == "radio" && inp[i].checked) {
              drawingType = inp[i].value;
          }
      }
  }

  // Add the event listeners for mousedown, mousemove, and mouseup
  canvas.addEventListener('mousedown', e => {
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  isDrawing = true;
  });

  canvas.addEventListener('mousemove', e => {
    if (isDrawing === true) {
      if (drawingType === "line") {
        drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top, lineThickness, lineColor);
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
    }
  });
  
  window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
      if (drawingType === "line") {
        drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top, lineThickness, lineColor);
      }
      if (drawingType === "fillRect") {
        drawFillRect(context, x, y, e.clientX - rect.left - x, e.clientY - rect.top - y, lineColor);
      }
      if (drawingType === "strokeRect") {
        drawStrokeRect(context, x, y, e.clientX - rect.left - x, e.clientY - rect.top - y, lineColor);
      }
      x = 0;
      y = 0;
      isDrawing = false;
    }
  });
  
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
}
