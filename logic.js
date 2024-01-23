const canvas = document.getElementById('canvas');
canvas.width = screen.width / 2;
canvas.height = screen.height / 2;

let plist = [];
let curveColor = 'rgba(255,255,255,0)'; // transparent white

let mouseX;
let mouseY;

const marginLeft = canvas.getBoundingClientRect().x;
const marginTop = canvas.getBoundingClientRect().y;

let addPointsButton = document.getElementById("add-points-btn");
let clearScreenButton = document.getElementById("clear-screen-btn");
let showCurveButton = document.getElementById("show-curve-btn");

document.addEventListener("mousemove", function (e) {
    e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function binom(n, k) {
    let coeff = 1;
    for (let i = n - k + 1; i <= n; i++) 
        coeff *= i;

    for (let i = 1; i <= k; i++) 
        coeff /= i;

    return coeff;
}

function bezier(t, plist) {
    let order = plist.length - 1;

    let y = 0;
    let x = 0;

    for (i = 0; i <= order; i++) {
        x = x + (binom(order, i) * Math.pow((1 - t), (order - i)) * Math.pow(t, i) * (plist[i].x));
        y = y + (binom(order, i) * Math.pow((1 - t), (order - i)) * Math.pow(t, i) * (plist[i].y));
    }

    return {
        x: x,
        y: y
    };
}

// draw the points
function draw(plist) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const accuracy = 0.01;
    ctx.beginPath();
    ctx.moveTo(plist[0].x, plist[0].y);

    for (p in plist) {
        ctx.fillText(p, plist[p].x + 7, plist[p].y - 7);
        ctx.fillRect(plist[p].x - 5, plist[p].y - 5, 12, 12);
    }

    ctx.strokeStyle = curveColor;
    ctx.lineWidth = 4;
    for (let i = 0; i < 1; i += accuracy) {
        let p = bezier(i, plist);
        ctx.lineTo(p.x, p.y);
    } 

    ctx.stroke();
    ctx.closePath();
}

// draw the Bezier Curve
function drawCurve(plist) {
    let ctx = canvas.getContext('2d');
    const accuracy = 0.01;
    ctx.beginPath();

    ctx.strokeStyle = curveColor;
    ctx.lineWidth = 4;
    for (let i = 0; i < 1; i += accuracy) {
        let p = bezier(i, plist);
        ctx.lineTo(p.x, p.y);
    }    

    ctx.stroke();
    ctx.closePath();
}
function isPositionInvalid(x, y) {
    return x < marginLeft || x > marginLeft + canvas.width || y < marginTop || y > marginTop + canvas.height
}

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

clearScreenButton.addEventListener("click", function (e) { 
    plist = [];
    draw(plist);
 })

showCurveButton.addEventListener('click', function (e) { 
    if(showCurveButton.value == "on") {
        showCurveButton.value = "off";
        showCurveButton.innerText = 'Show Curve';
        curveColor = 'rgba(255,255,255,0)';
    }
    else {
        showCurveButton.value = 'on';
        showCurveButton.innerText = 'Hide Curve';
        curveColor = 'red';
    }
    
    draw(plist);
 })

document.addEventListener("click", function (e) {
    if(isPositionInvalid(mouseX, mouseY) || addPointsButton.value == 'off')
        return;
    
    plist.push({
        x: mouseX - marginLeft,
        y: mouseY - marginTop
    });

    draw(plist);
});
