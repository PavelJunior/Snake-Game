const BACKGROUND_COLOR_ONE = '#bcff76';
const BACKGROUND_COLOR_TWO = '#a9f565';
const SNAKE_HEAD = '#4685ff';
const SNAKE_BODY = '#57baff';
const HEADER_COLOR = '#84c068';
const TOPOFFSET = 80;
const WIDTH = 600;
const HEIGHT = 600;
const CELL = 40;
const TIMEOUT = 100;
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');

const foodImg = new Image();
foodImg.src = 'img/food.png';

const goldcupImg = new Image();
goldcupImg.src = 'img/goldcup.png';

let snake = [];
let food = {};
let score = 0;
let bestScore = 0;
let direction = "DOWN";
let prevDirection = "DOWN";
let gameOver = false;
let newBestScore = false;
let game;


function draw(){
    //draw header
    ctx.fillStyle = HEADER_COLOR;
    ctx.fillRect(0, 0, WIDTH, TOPOFFSET);
    ctx.fillStyle = 'white';
    ctx.font = '45px Arial';
    ctx.fillText(score, CELL*2.75, TOPOFFSET/1.45);
    ctx.drawImage(foodImg ,CELL, CELL/2, CELL, CELL);
    ctx.fillText(bestScore, WIDTH - CELL*2.5, TOPOFFSET/1.45);
    ctx.drawImage(goldcupImg ,WIDTH - CELL*4.5, CELL/2, CELL+5, CELL+5);


    //draw background
    for(let i = 0; i < WIDTH/CELL; i++){
        for(let j = 0; j < HEIGHT/CELL; j++){
            ctx.fillStyle = (i+j)%2 ? BACKGROUND_COLOR_ONE : BACKGROUND_COLOR_TWO;
            ctx.fillRect(i * CELL, j * CELL + TOPOFFSET, CELL, CELL);
        }
    }

    //draw snake
    for(let i = 0; i < snake.length; i++){
        ctx.fillStyle = (i === 0) ? SNAKE_HEAD : SNAKE_BODY;
        ctx.fillRect(snake[i].x, snake[i].y + TOPOFFSET, CELL, CELL);
    }

    //draw food
    ctx.drawImage(foodImg ,food.x, food.y + TOPOFFSET, CELL, CELL);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    //get next cell for head
    if(direction === "LEFT") snakeX -= CELL;
    else if(direction === "UP") snakeY -= CELL;
    else if(direction === "RIGHT") snakeX += CELL;
    else if(direction === "DOWN") snakeY += CELL;

    prevDirection = direction;

    //make snake able to go throw wall and appear on the opposite side
    snakeX = snakeX % WIDTH;
    if(snakeX < 0) snakeX += WIDTH;
    snakeY = snakeY % HEIGHT;
    if(snakeY < 0) snakeY += HEIGHT;

    //check if the snake ate foot
    if(snakeX === food.x && snakeY === food.y){
        score++;
        if(score > bestScore) newBestScore = true;
        if(bestScore < score) bestScore = score;
        food = makeFood(snake, snakeX, snakeY);
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    //check if the snake ate itself
    if(collision(newHead, snake)){
        gameOver = true;
        clearInterval(game);
        ctx.fillStyle = 'rgba(0,0,0, 0.5)';
        ctx.fillRect(50, 220, 500, 250);
        ctx.fillStyle = 'white';
        ctx.font = '60px Arial';
        ctx.fillText("GAME OVER", 120, 300);
        if(newBestScore){
            newBestScore = false;
            ctx.font = '35px Arial';
            ctx.fillText("New record: " + score, 200, 360);
        } else {
            ctx.font = '25px Arial';
            ctx.fillText("Your score: " + score, 90, 350);
            ctx.fillText("Best score: " + bestScore, 360, 350);
        }
        ctx.font = '27px Arial';
        ctx.fillText("Press enter to try again", 160, 420);
        document.addEventListener('keydown', (e) => {
            if(e.key === "Enter" && gameOver){
                startGame();
                gameOver = false;
            }
        });
    }

    snake.unshift(newHead);
}

//reset game
function startGame(){
    snake = makeSnake();
    food = makeFood(snake);
    score = 0;
    direction = "DOWN";
    clearInterval(game);
    game = setInterval(draw, TIMEOUT);
}

//make starting snake
function makeSnake(){
    snake = [];
    for(let i = 0; i < 3; i++){
        snake[i] = {x: 8 * CELL, y: (8-i) * CELL};
    }
    return snake;
}

//make food and check that food didn't created on the snake body
function makeFood(snake, nextHeadX = null, nextHeadY = null){
    let food;
    let onSnake = true;

    while(onSnake){
        onSnake = false;
        food = {
            x : Math.floor(Math.random() * 15) * CELL,
            y : Math.floor(Math.random() * 15) * CELL
        };
        for(let i = 0; i < snake.length-1; i++){
            if(snake[i].x === food.x && snake[i].y === food.y || food.x === nextHeadX && food.y === nextHeadY){
                onSnake = true
            }
        }
    }
    return food;
}

//check if the snake ate itself
function collision(head, array){
    for(let i = 0; i < array.length; i++){
        if(head.x === array[i].x && head.y === array[i].y){
            return true;
        }
    }
    return false;
}

//get current direction
document.addEventListener('keydown', getDirection);

function getDirection(event){
    if((event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') && prevDirection !== "RIGHT"){
        direction = "LEFT";
    } else if((event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') && prevDirection !== "DOWN"){
        direction = "UP";
    } else if((event.key === 'ArrowRight'  || event.key.toLowerCase() === 'd') && prevDirection !== "LEFT"){
        direction = "RIGHT";
    } else if((event.key === 'ArrowDown' || event.key.toLowerCase() === 's') && prevDirection !== "UP"){
        direction = "DOWN";
    }
}