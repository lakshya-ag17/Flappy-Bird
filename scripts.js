//Canvas Variables
const canvasHeight= 457;
const canvasWidth= 500;

//Bird Variables
const birdHeight = 20;
const birdWidth = 30;
let birdX = canvasWidth/8;
let birdY = canvasHeight/2;
let birdImg;

let bird={
    width:birdWidth,
    height:birdHeight,
    x:birdX,
    y:birdY
};

//pipes variables
let pipeArrayTop =[];
let pipeArrayBottom=[];
let pipeWidth = 50;
let pipeHeight = 300;
let pipeX = canvasWidth;
let pipeY =0;
let topPipeImg;
let bottomPipeImg;
let topPipe;
let bottomPipe;

//velocities in both axes
let velocityX = -4;
let velocityY = 0;
let gravity = 0.3;

// initial condition
let gameOver = false;
let score = 0;

//on loading the page
window.onload= function(){
    canvas = document.getElementById("myCanvas");
    canvas.height= canvasHeight;
    canvas.width=canvasWidth;
    ctx = canvas.getContext("2d");

    // generating bird image
    birdImg = new Image();
    birdImg.src = "bird.png";
    birdImg.onload = function() {
        ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    // loading pipe images
    topPipeImg = new Image();
    topPipeImg.src = "pipeTop.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "pipeBottom.png";
    
    //starting animation using frame by frame gameplay
    requestAnimationFrame(gameLoop);

    //Adding pipes to pipeArray every 1.5 sec
    setInterval(generatePipes, 1500);

    //Moving bird on keydown
    document.addEventListener('keydown', birdMovement);
}


function gameLoop() {
    requestAnimationFrame(gameLoop);
    
    //stopping gameloop is gameover
    if (gameOver){
        return

    }
    //clearing canvas at the start of each frame
    ctx.clearRect(0,0, canvasWidth, canvasHeight);

    //re-drawing bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //changing position due to velocity
    velocityY+=gravity;
    bird.y = Math.max(bird.y+velocityY, 0);
    bird.y += velocityY;

    //gameover is bird falls down
    if (bird.y>canvasHeight){
        gameOver=true;
    }


    //Drawing pipes by looping through pipeArray
    for (let i=0;i<pipeArrayTop.length;i++){
        let topPipe = pipeArrayTop[i];
        let bottomPipe = pipeArrayBottom[i];
        topPipe.x+= velocityX;
        bottomPipe.x+= velocityX;
        ctx.drawImage(topPipe.img, topPipe.x, topPipe.y, topPipe.width, topPipe.height);
        ctx.drawImage(bottomPipe.img, bottomPipe.x, bottomPipe.y, bottomPipe.width, bottomPipe.height);

        //adding score if pipes passed
        if (!topPipe.passed && bird.x > topPipe.x + pipeWidth){
            score+=1;
            topPipe.passed=true;
        }

        //Detecting Collision
        if (detectCollision(bird,topPipe,bottomPipe)){
            gameOver=true;
        }
    }

    ctx.fillStyle = 'White';
    ctx.font="45px sans-serif";
    ctx.fillText(score, 5, 45);

    if (gameOver){
        ctx.fillText("GAME OVER", 5,90);
    }
    
}


function generatePipes(){

    if (gameOver){
        return
    }

    topPipeRandomY = -(Math.random() * (0-(-183)) +0);

    topPipe = {
        img: topPipeImg,
        x:pipeX,
        y:topPipeRandomY,
        width:pipeWidth,
        height:pipeHeight,
        passed: false
    };

    bottomPipe = {
        img: bottomPipeImg,
        x:pipeX,
        y:(topPipeRandomY+300)+birdHeight+80, //having gap of birdheight+80px between the two pipes
        width:pipeWidth,
        height:pipeHeight,
        passed: false
    };

    pipeArrayTop.push(topPipe);
    pipeArrayBottom.push(bottomPipe);
}


function birdMovement(e){

    //changing velocity on click
    if (e.code=='Space' || e.code=='ArrowUp' || e.code=='W'){
        velocityY=-4;
    }
    
    //restarting game on click if gameover
    if (gameOver){
        bird.y = birdY;
        pipeArrayTop=[];
        pipeArrayBottom=[];
        score=0;
        gameOver=false;
    }
}


//detecting collision by matching x and y coords of pipes and bird
function detectCollision(bird,topPipe,bottomPipe){
    return  (bird.x + bird.width > topPipe.x &&
            topPipe.x + topPipe.width > bird.x &&
            bird.y + bird.height > topPipe.y &&
            topPipe.y + topPipe.height > bird.y) || 
            (bird.x + bird.width > bottomPipe.x &&
            bottomPipe.x + bottomPipe.width > bird.x &&
            bird.y + bird.height > bottomPipe.y &&
            bottomPipe.y + bottomPipe.height > bird.y)
}
