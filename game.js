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
const restartSing = document.querySelector("#restart-container");
const restartButton = document.querySelector("#restart");


let canvasSize;
let elementSize;

const playerPosition = {
    x: undefined,
    y: undefined,
};
const playerPositionFinish = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
};
const explotionPosition = {
    x: undefined,
    y: undefined,
}

let obstacles = [];
let level = 0;
let lives = 3;

let timeStart;
let player_time;
let timeInterval;


window.addEventListener("load", setCanvasSize);
window.addEventListener("resize",setCanvasSize);



function startGame() {

    game.font = elementSize + "px Verdana";
    game.textAlign = 'end';
    game.padding = "10px";
    

    let mapString = maps[level];

    if (!mapString) {
        gameWin();
        showRestartSing();
        level = level - 1;
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
            let emoji = emojis[col];
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
                // if (explotionPosition.x && explotionPosition.y){
                //     game.fillText(emojis["BOMB_COLLISION"], explotionPosition.x, explotionPosition.y);
                //     explotionPosition.x = undefined;
                //     explotionPosition.y = undefined;
                // } else {
                //     game.fillText(emoji, positionX,positionY);
                // }
            

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
        levelWin();
    }

    const enemyColition = obstacles.find(enemy => {
        const enemyColitionx = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyColitiony = enemy.y.toFixed(3)  == playerPosition.y.toFixed(3);
        if ( enemyColitionx && enemyColitiony) {
            game.fillText(emojis["BOMB_COLLISION"], enemy.x, enemy.y);
        }
        return enemyColitionx && enemyColitiony;
    })

    if (enemyColition) {

        setTimeout(restartLevel, 1000);
    } else {
        game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
    }

    
}

function setCanvasSize(){
   

    if (window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.70;
    } else {
        canvasSize = window.innerHeight * 0.70;
    }
    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute("width",canvasSize);
    canvas.setAttribute("height",canvasSize);

    elementSize = (canvasSize / 10);

    // playerPosition.x = (playerPosition.x * elementSize);
    // playerPosition.y = (playerPosition.y * elementSize);
    // console.log(playerPosition.x,playerPosition.y,elementSize)

    playerPosition.x = undefined;
    playerPosition.y = undefined;


    startGame();
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
restartButton.addEventListener("click", restartGame);


function moveUp() {
    playerPosition.y -= elementSize;
    if (playerPosition.y < 0) {
        playerPosition.y += elementSize;
    }
    startGame();
}
function moveDown(){
    playerPosition.y += elementSize;
    if (playerPosition.y > elementSize * 10) {
        playerPosition.y -= elementSize;
    }
    startGame();

}
function moveRight(){
    playerPosition.x += elementSize;
    if (playerPosition.x > elementSize * 11) {
        playerPosition.x -= elementSize;
    }
    startGame();
}
function moveLeft() {
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
    player_time = Date.now() - timeStart;


    if (record_time) {
        // debugger
        if (record_time >= player_time) {
          localStorage.setItem('record_time', player_time);
          showResult("Congradulations you set a new record!");
        } else {
            showResult("Sorry");
        }
      } else {
        localStorage.setItem('record_time', player_time);
        showResult("It's your first time playing, now set a new record!");
      }
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

function showRestartSing(){
    restartSing.classList.remove("hide");
}
function restartGame(){
    location.reload();
}
