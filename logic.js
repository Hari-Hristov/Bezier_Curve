const canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.width = screen.width / 2;
canvas.height = screen.height / 2;

// fix the slider's movement
let plist = [];
const transparentWhite = 'rgba(255,255,255,0)';

let curveColor = transparentWhite;
let linesColor = curveColor;
let subColor = 'white';

let mouseX;
let mouseY;
let showCurve = false;
let id;

const marginLeft = canvas.getBoundingClientRect().x;
const marginTop = canvas.getBoundingClientRect().y;

let slider = document.getElementById("slider");
let t = slider.value;

let addPointsButton = document.getElementById("add-points-btn");
let clearScreenButton = document.getElementById("clear-screen-btn");
let showCurveButton = document.getElementById("show-curve-btn");
let showSubdivisionsButton = document.getElementById("show-subdivisions-btn");

function fixSlider() {
    t = parseFloat(slider.value);
    draw();
    
    const minValueLabel = document.getElementById('minValue');
    const currentValueLabel = document.getElementById('currentValue');
    const maxValueLabel = document.getElementById('maxValue');

    minValueLabel.innerText = `Min Value: ${slider.min}`;
    currentValueLabel.innerText = `Current Value: ${parseFloat(slider.value).toFixed(2)}`;
    maxValueLabel.innerText = `Max Value: ${slider.max}`;
}
document.addEventListener("mousemove", function (e) {
    e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;
});

slider.addEventListener('mousemove', function(event) {
    let boundingRect = slider.getBoundingClientRect();
    let mouseX = event.clientX - boundingRect.left;
    let sliderWidth = boundingRect.width;
    let percent = mouseX / sliderWidth;
    let newValue = percent * (slider.max - slider.min);
    slider.value = newValue;
    fixSlider();
});

slider.addEventListener('click', function(e) {
    t = parseFloat(slider.value);
    cancelAnimationFrame(id);
    
    const minValueLabel = document.getElementById('minValue');
    const currentValueLabel = document.getElementById('currentValue');
    const maxValueLabel = document.getElementById('maxValue');

    minValueLabel.innerText = `Min Value: ${slider.min}`;
    currentValueLabel.innerText = `Current Value: ${parseFloat(slider.value).toFixed(2)}`;
    maxValueLabel.innerText = `Max Value: ${slider.max}`;

    draw();
})


function isPositionInvalid(x, y) {
    return x < marginLeft || x > marginLeft + canvas.width || y < marginTop || y > marginTop + canvas.height
}

function deCasteljau(points, t) {
    if (points.length == 1) {
        return points[0];
    } 
    else {
        let newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            let x = (1 - t) * points[i].x + t * points[i + 1].x;
            let y = (1 - t) * points[i].y + t * points[i + 1].y;
            newPoints.push({x, y});
        }
        return deCasteljau(newPoints, t);
    }
}

function drawCurve(ctx, points, color='rgb(59,91,165)')
{
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i <= 1; i += 0.01) {
        let nextBezierPoint = deCasteljau(points, i);
        ctx.lineTo(nextBezierPoint.x, nextBezierPoint.y);
    }

    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawPoints(ctx, points, color = 'rgb(232,122,93)') {
    context.fillStyle = color;
    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawLines(context, points, color='rgb(243,185,65)')
{
    context.beginPath();
    context.strokeStyle = 'orange';
    context.moveTo(points[0].x, points[0].y);
  
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
  
    context.stroke();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPoints(context, plist);
    drawLines(context, plist);

    if (plist.length > 1) {
        let currentPoints = [...plist];

        while (currentPoints.length > 1) {
            currentPoints = calculateSubdivide(currentPoints, t);
            if(showCurve) {
                drawCurve(context, plist);
            }
            drawPoints(context, currentPoints, 'brown');
            drawLines(context, currentPoints);
    }

    drawPoints(context, currentPoints);

    id = requestAnimationFrame(draw);
  }
}

function calculateSubdivide(points, t) {
    const subdividedPoints = [];
  
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
  
      const interpolatedPoint = linearInterpolation(prevPoint, currentPoint, t);
      subdividedPoints.push(interpolatedPoint);
    }
  
    return subdividedPoints;
}

function linearInterpolation(p0, p1, t) {
    return {
      x: p0.x + (p1.x - p0.x) * t,
      y: p0.y + (p1.y - p0.y) * t,
    };
}

document.addEventListener("click", function (e) {
    if(isPositionInvalid(mouseX, mouseY) || addPointsButton.value == 'off')
        return;
    
    plist.push({
        x: mouseX - marginLeft,
        y: mouseY - marginTop
    });

    draw();
});

addPointsButton.addEventListener("click", function(e) {
    if(addPointsButton.value == "on") {
        addPointsButton.value = "off";
        addPointsButton.innerText = "Add Points";
    }
    else {
        addPointsButton.value = "on";
        addPointsButton.innerText = "Stop Adding Points";
    }
})

showCurveButton.addEventListener('click', function(e) {
    if(!showCurve) {
        showCurveButton.innerText = "Hide Curve";
    }
    else {
        showCurveButton.innerText = 'Show Curve'
    }

    showCurve = !showCurve;
    
    draw();
})

clearScreenButton.addEventListener("click", function (e) { 
    plist = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
 })