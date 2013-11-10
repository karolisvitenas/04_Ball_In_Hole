window.onload = init;

var winW, winH;
var ball;
var mouseDownInsideball;
var touchDownInsideball;
var movementTimer;
var lastMouse, lastOrientation, lastTouch;

                            
// Initialisation on opening of the window
function init() {
    lastOrientation = {};
    window.addEventListener('resize', doLayout, false);
    document.body.addEventListener('mousemove', onMouseMove, false);
    document.body.addEventListener('mousedown', onMouseDown, false);
    document.body.addEventListener('mouseup', onMouseUp, false);
    document.body.addEventListener('touchmove', onTouchMove, false);
    document.body.addEventListener('touchstart', onTouchDown, false);
    document.body.addEventListener('touchend', onTouchUp, false);
    window.addEventListener('deviceorientation', deviceOrientationTest, false);
    lastMouse = {
        x:0, 
        y:0
    };
    lastTouch = {
        x:0, 
        y:0
    };
    mouseDownInsideball = false;
    touchDownInsideball = false;
    doLayout(document);
}

// Does the gyroscope or accelerometer actually work?
function deviceOrientationTest(event) {
    window.removeEventListener('deviceorientation', deviceOrientationTest);
    if (event.beta != null && event.gamma != null) {
        window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
        movementTimer = setInterval(onRenderUpdate, 10); 
    }
}

function doLayout(event) {
    winW = window.innerWidth;
    winH = window.innerHeight;
    var surface = document.getElementById('surface');
    surface.width = winW;
    surface.height = winH;
    var radius = 10;
    ball = {
        radius:radius,
        x:Math.round(winW/2),
        y:Math.round(winH/2),
        color:'rgba(164, 168, 57, 255)'
    };
    hole = {
        radius:radius,
        x:Math.round(winW-100),
        y:Math.round(winH-100),
        color:'rgba(000, 0, 0, 225)'
    };
				
    renderBall();
}
	
function renderBall() {
    var surface = document.getElementById('surface');
    var context = surface.getContext('2d');
    context.clearRect(0, 0, surface.width, surface.height);
	
    
    context.arc(hole.x, hole.y, hole.radius+5, 0, 2 * Math.PI, false);
    context.fillStyle = hole.color;
    context.fill();
    
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    context.fillStyle = ball.color;
    context.fill();
} 

function onRenderUpdate(event) {
    var xDelta, yDelta;
    switch (window.orientation) {
        case 0: // portrait - normal
            xDelta = lastOrientation.gamma;
            yDelta = lastOrientation.beta;
            break;
        case 180: // portrait - upside down
            xDelta = lastOrientation.gamma * -1;
            yDelta = lastOrientation.beta * -1;
            break;
        case 90: // landscape - bottom right
            xDelta = lastOrientation.beta;
            yDelta = lastOrientation.gamma * -1;
            break;
        case -90: // landscape - bottom left
            xDelta = lastOrientation.beta * -1;
            yDelta = lastOrientation.gamma;
            break;
        default:
            xDelta = lastOrientation.gamma;
            yDelta = lastOrientation.beta;
    }
    //moveBall(xDelta, yDelta);
    setBounds(xDelta, yDelta); //new line
}

function moveBall(xDelta, yDelta) {
   if (pause == false){
    ball.x += xDelta;
    ball.y += yDelta;
    renderBall();
    check();
    }
}

function setBounds(xDelta, yDelta){
    if( ball.x<(ball.radius-xDelta)+1 || ball.x>winW-(ball.radius+xDelta)-1) xDelta=-xDelta;
    if( ball.y<(ball.radius-yDelta)+1+42 || ball.y>winH-35-(ball.radius+yDelta)-1) yDelta=-yDelta;
    
        moveBall(xDelta, yDelta);
    
}

function check(){
    var time;
    //&& (ball.y > winH-85 && ball.y < winH))
    if ((ball.x > winW-100 && ball.x < winW-85) && (ball.y > winH-115 && ball.y < winH-100)) {
        alert('You won!' + document.getElementById("chronotime").innerHTML);
        stopGame();
    }
}

function onMouseMove(event) {
    if(mouseDownInsideball){
        var xDelta, yDelta;
        xDelta = event.clientX - lastMouse.x;
        yDelta = event.clientY - lastMouse.y;
        setBounds(xDelta, yDelta);
        lastMouse.x = event.clientX;
        lastMouse.y = event.clientY;
    }
}

function onMouseDown(event) {
    var x = event.clientX;
    var y = event.clientY;
    if(	x > ball.x - ball.radius &&
        x < ball.x + ball.radius &&
        y > ball.y - ball.radius &&
        y < ball.y + ball.radius){
        mouseDownInsideball = true;
        lastMouse.x = x;
        lastMouse.y = y;
    } else {
        mouseDownInsideball = false;
    }
} 

function onMouseUp(event) {
    mouseDownInsideball = false;
}

function onTouchMove(event) {
    event.preventDefault();	
    if(touchDownInsideball){
        var touches = event.changedTouches;
        var xav = 0;
        var yav = 0;
        for (var i=0; i < touches.length; i++) {
            var x = touches[i].pageX;
            var y =	touches[i].pageY;
            xav += x;
            yav += y;
        }
        xav /= touches.length;
        yav /= touches.length;
        var xDelta, yDelta;

        xDelta = xav - lastTouch.x;
        yDelta = yav - lastTouch.y;
        setBounds(xDelta, yDelta);
        lastTouch.x = xav;
        lastTouch.y = yav;
    }
}

function onTouchDown(event) {
    event.preventDefault();
    touchDownInsideball = false;
    var touches = event.changedTouches;
    for (var i=0; i < touches.length && !touchDownInsideball; i++) {
        var x = touches[i].pageX;
        var y = touches[i].pageY;
        if(	x > ball.x - ball.radius &&
            x < ball.x + ball.radius &&
            y > ball.y - ball.radius &&
            y < ball.y + ball.radius){
            touchDownInsideball = true;		
            lastTouch.x = x;
            lastTouch.y = y;			
        }
    }
} 

function onTouchUp(event) {
    touchDownInsideball = false;
}

function onDeviceOrientationChange(event) {
    lastOrientation.gamma = event.gamma;
    lastOrientation.beta = event.beta;
}

var startTime = 0
var start = 0
var end = 0
var diff = 0
var timerID = 0
function chrono(){
    end = new Date()
    diff = end - start
    diff = new Date(diff)
    var sec = diff.getSeconds()
    var min = diff.getMinutes()
    if (min < 10){
        min = "0" + min
    }
    if (sec < 10){
        sec = "0" + sec
    }
    document.getElementById("chronotime").innerHTML = min + ":" + sec
    time = min;
    timerID = setTimeout("chrono()", 10)
}
function chronoStart(){
    start = new Date()
    chrono()
    pause = false;
}
function chronoContinue(){
    document.chronoForm.startstop.onclick = chronoPause
    start = new Date()-diff
    start = new Date(start)
    chrono()
}
function chronoStop(){
    document.getElementById("chronotime").innerHTML = "00:00"
    //document.chronoForm.startstop.onclick = chronoStart
    start = new Date()
    doLayout()
}
function chronoStopReset(){
    document.chronoForm.startstop.onclick = chronoStart
}
function chronoPause(){
    document.chronoForm.startstop.onclick = chronoContinue
    document.chronoForm.reset.onclick = chronoStopReset
    clearTimeout(timerID)
}

//game functions
function startGame(){
     
    chronoStart();
}
function stopGame(){
    chronoStop();
    pause = false;
}
function pauseGame(){
    chronoPause();
    pause = true;
}