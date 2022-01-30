//
const canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
//
var brickRowCount = 5;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 20;
var brickOffsetLeft = 30;
//
var bricks = [];
for (var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, hitStatus: 1};
    }
}

var score = 0;
var lives = 3;
var playMusic;
//
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 10, 0, Math.PI*2);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c=0; c<brickColumnCount; c++) {
        for (var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].hitStatus == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle ="blue";
                ctx.fill();
                ctx.closePath();
            }
                
        } 
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBricks();
    drawBall();
    drawPaddle();
    collsionDetection();
    drawScore();
    drawLives();
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("Game Over! You Scored: "+score);
                document.location.reload();
            } else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    } 

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if(e. key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collsionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++){
            var b = bricks[c][r];
            if(b.hitStatus == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
                dy = -dy
                b.hitStatus = 0;
                score++;
                if(score == brickRowCount*brickColumnCount) {
                    alert("CLEARED! You Scored: " + score);
                    document.location.reload();
                    }
                }
            }
            
        }
    }
}

function drawScore() {
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: "+ score, 8, 20);
} 

function drawLives() {
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Lives: "+ lives, canvas.width-65, 20)
}
//
draw();