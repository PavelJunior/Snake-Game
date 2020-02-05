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
let d = "DOWN";
let prevD = "DOWN";

startGame();
setInterval(draw, TIMEOUT);

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
        ctx.fillStyle = (i == 0) ? SNAKE_HEAD : SNAKE_BODY;
        ctx.fillRect(snake[i].x, snake[i].y + TOPOFFSET, CELL, CELL);
    }

    //draw food
    ctx.drawImage(foodImg ,food.x, food.y + TOPOFFSET, CELL, CELL);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    //get next cell for head
    if(d === "LEFT") snakeX -= CELL;
    if(d === "UP") snakeY -= CELL;
    if(d === "RIGHT") snakeX += CELL;
    if(d === "DOWN") snakeY += CELL;

    prevD = d;

    //make snake able to go throw wall and appear on the opposite side
    snakeX = snakeX % WIDTH;
    if(snakeX < 0) snakeX += WIDTH;
    snakeY = snakeY % HEIGHT;
    if(snakeY < 0) snakeY += HEIGHT;

    //check if the snake ate foot
    if(snakeX === food.x && snakeY === food.y){
        score++;
        if(bestScore < score) bestScore = score;
        food = makeFood(snake);
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    //check if the snake ate itself
    if(collision(newHead, snake)){
        startGame();
    }

    snake.unshift(newHead);
}

//reset game
function startGame(){
    snake = makeSnake();
    food = makeFood(snake);
    score = 0;
}

//make starting snake
function makeSnake(){
    snake = [];
    for(let i = 0; i < 3; i++){
        snake[i] = {x: 8 * CELL, y: (8-i) * CELL};
    }
    return snake;
}

//make food and check that food didn't created in the snake body
function makeFood(snake){
    let food;
    let onSnake = true;

    while(onSnake){
        onSnake = false;
        food = {
            x : Math.floor(Math.random() * 15) * CELL,
            y : Math.floor(Math.random() * 15) * CELL
        };
        for(let i = 0; i < snake.length; i++){
            if(snake[i].x === food.x && snake[i].y === food.y){
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
document.addEventListener('keydown', direction);
function direction(event){
    if(event.key === 'ArrowLeft' && prevD !== "RIGHT"){
        d = "LEFT";
    } else if(event.key === 'ArrowUp' && prevD !== "DOWN"){
        d = "UP";
    } else if(event.key === 'ArrowRight' && prevD !== "LEFT"){
        d = "RIGHT";
    } else if(event.key === 'ArrowDown' && prevD !== "UP"){
        d = "DOWN";
    }
}