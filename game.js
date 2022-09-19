const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const buttonUp = document.querySelector("#up");
const buttonDown = document.querySelector("#down");
const buttonRight = document.querySelector("#right");
const buttonLeft = document.querySelector("#left");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#timer");
const spanRecord = document.querySelector("#record");
const pResults = document.querySelector("#result");


let canvasSize;
let elementSize;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
};

let obstacles = [];
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;


window.addEventListener("load", setCanvasSize);
window.addEventListener("resize",setCanvasSize);



function startGame() {

    game.font = elementSize + "px Verdana";
    game.textAlign = 'end';
    game.padding = "10px";
    

    const mapString = maps[level];

    if (!mapString) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100);
        showRecord();
    }

    const map = mapString.trim().split("\n");
    const mapArray = map.map(row => row.trim().split(""));

    game.clearRect(0,0,canvasSize, canvasSize); 
    obstacles = [];

    showLives();

    mapArray.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            const emoji = emojis[col];
            const positionX = (colIndex + 1) * elementSize + 10;
            const positionY = (rowIndex + 1) * elementSize - 10;

                if (col == "O") {
                    if (!playerPosition.x && !playerPosition.y) {
                        playerPosition.x = positionX;
                        playerPosition.y = positionY;
                    }
                } else if (col == "I"){
                    giftPosition.x = positionX;
                    giftPosition.y = positionY;
                    
                } else if (col == "X"){
                    obstacles.push({
                        x: positionX,
                        y:positionY
                    })
                }
            

            game.fillText(emoji, positionX,positionY);
        })
    })

    movePlyer();

}

function movePlyer(){
    const giftColitionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftColitionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftColition =  giftColitionX && giftColitionY;

    if (giftColition) {
        console.log("You winn!");
        levelWin();
    }

    const enemyColition = obstacles.find(enemy => {
        const enemyColitionx = enemy.x.toFixed(3) == playerPosition.x.toFixed(3) ;
        const enemyColitiony = enemy.y.toFixed(3)  == playerPosition.y.toFixed(3) ;
        return enemyColitionx && enemyColitiony;
    })

    if (enemyColition) {
        restartLevel();
    }

    game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function setCanvasSize(){
   

    if (window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.80;
    } else {
        canvasSize = window.innerHeight * 0.80;
    }

    canvas.setAttribute("width",canvasSize);
    canvas.setAttribute("height",canvasSize);

    elementSize = (canvasSize / 10);
    startGame()
}

window.addEventListener("keyup",(element) => {
    if (element.key === "ArrowUp" ) moveUp();
    if (element.key === "ArrowDown" ) moveDown();
    if (element.key === "ArrowRight" ) moveRight();
    if (element.key === "ArrowLeft" ) moveLeft();
})

buttonUp.addEventListener("click", moveUp);
buttonDown.addEventListener("click", moveDown);
buttonRight.addEventListener("click", moveRight);
buttonLeft.addEventListener("click", moveLeft);


function moveUp() {
    console.log("moveUp");
    playerPosition.y -= elementSize;
    if (playerPosition.y < 0) {
        playerPosition.y += elementSize;
    }
    startGame();
}
function moveDown(){
    console.log("moveDown");
    playerPosition.y += elementSize;
    if (playerPosition.y > elementSize * 10) {
        playerPosition.y -= elementSize;
    }
    startGame();

}
function moveRight(){
    console.log("moveRight");
    playerPosition.x += elementSize;
    if (playerPosition.x > elementSize * 11) {
        playerPosition.x -= elementSize;
    }
    startGame();
}
function moveLeft() {
    console.log("moveLeft");
    playerPosition.x -= elementSize;
    if (playerPosition.x <= elementSize) {
        playerPosition.x += elementSize;
    }
    startGame();
}
function levelWin(){
    level++
    startGame();
}

function restartLevel(){
    lives--
    if (lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin(){
    console.log("you finsh");

    const record_time = localStorage.getItem("record_time");
    timePlayer = Date.now() - timeStart;
    
    setRecordTime(record_time);
    clearInterval(timeInterval);

}

function showLives(){
    const livesArray = Array(lives).fill(emojis["HEART"]);
    spanLives.innerHTML = emojis["HEART"].repeat(lives);

}

function showTime(){
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem("record_time");
}

function showResult(message){
    if(message){
        pResults.innerHTML = message;
    } else {
        console.log("there is not message");
    }
    
}

function setRecordTime(record_time){
    if(record_time){
        if(record_time > timePlayer){
            localStorage.setItem("record_time", timePlayer);
            showResult("Congradulations you set a new record!")
        } else {
            showResult("Sorry buddy you need to practice more =(")
        }
    } else {
        localStorage.setItem("record_time", timePlayer);
        showResult("Congradulations your first time playing!")
    }
}