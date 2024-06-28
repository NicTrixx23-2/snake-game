// Constants
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE_LENGTH = 5;
const GAME_SPEED = 100; // in milliseconds

// Variables
let snake;
let food;
let dx = GRID_SIZE;
let dy = 0;
let changingDirection = false;
let score = 0;

// Get the canvas element and context
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

// Start game
initializeGame();

// Main function to start the game
function initializeGame() {
    // Reset snake position and direction
    snake = [{ x: 200, y: 200 }];
    for (let i = 1; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.push({ x: 200 - i * GRID_SIZE, y: 200 });
    }

    // Place initial food
    food = createFood();

    // Start game loop
    main();
    
    // Add event listener for keyboard input
    document.addEventListener("keydown", changeDirection);
}

// Function to create food at a random position
function createFood() {
    return {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE,
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE
    };
}

// Main game loop
function main() {
    if (gameOver()) return;

    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();

        // Call main function again
        main();
    }, GAME_SPEED);
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

// Function to draw the snake
function drawSnake() {
    snake.forEach(drawSnakePart);
}

// Function to draw each part of the snake
function drawSnakePart(snakePart) {
    ctx.fillStyle = "#008000";
    ctx.strokeStyle = "#000";
    ctx.fillRect(snakePart.x, snakePart.y, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(snakePart.x, snakePart.y, GRID_SIZE, GRID_SIZE);
}

// Function to move the snake
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if snake eats the food
    const eatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (eatFood) {
        score += 10;
        document.getElementById("score").innerHTML = "Score: " + score;
        food = createFood();
    } else {
        snake.pop();
    }
}

// Function to check if the game is over
function gameOver() {
    // Check if snake hits the wall or itself
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            alert("Game Over! Your score was " + score);
            location.reload(); // Reload the page to restart the game
            return true;
        }
    }

    // Check if snake hits the wall
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= CANVAS_SIZE;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= CANVAS_SIZE;
    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        alert("Game Over! Your score was " + score);
        location.reload(); // Reload the page to restart the game
        return true;
    }

    return false;
}

// Function to draw the food
function drawFood() {
    ctx.fillStyle = "#FF0000";
    ctx.strokeStyle = "#000";
    ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
}

// Function to handle keyboard input
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingRight = dx === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -GRID_SIZE;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -GRID_SIZE;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = GRID_SIZE;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = GRID_SIZE;
    }
}
