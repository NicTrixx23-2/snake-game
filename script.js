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
let gameRunning = false; // Flag to track if the game is running

// Get the canvas element and context
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

// Event listener to start the game when 'Q' is pressed
document.addEventListener("keydown", function(event) {
    if (event.key === "q" && !gameRunning) {
        startGame();
    }
});

// Function to start the game
function startGame() {
    gameRunning = true;
    initializeGame();
    main();
}

// Function to initialize the game
function initializeGame() {
    // Reset variables
    snake = [];
    dx = GRID_SIZE;
    dy = 0;
    score = 0;

    // Set up initial snake position
    snake.push({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 });
    for (let i = 1; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.push({ x: CANVAS_SIZE / 2 - i * GRID_SIZE, y: CANVAS_SIZE / 2 });
    }

    // Place initial food
    food = createFood();

    // Update score display
    document.getElementById("score").innerHTML = "Score: " + score;
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
    if (!gameRunning) return;

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
    ctx.fillRect(snakePart.x, snakePart.y, GRID_SIZE, GRID_SIZE);
}

// Function to move the snake
function moveSnake() {
    if (!gameRunning) return;

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

    // Check game over conditions
    if (gameOver()) {
        gameRunning = false;
        alert("Game Over! Your score was " + score);
        location.reload(); // Reload the page to restart the game
    }
}

// Function to check if the game is over
function gameOver() {
    // Check if snake hits the wall or itself
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // Check if snake hits the wall
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= CANVAS_SIZE;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= CANVAS_SIZE;
    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        return true;
    }

    return false;
}

// Function to draw the food
function drawFood() {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
}

// Function to handle keyboard input for snake movement
document.addEventListener("keydown", function(event) {
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    if (!gameRunning) return;

    // Prevent snake from reversing
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;

    // Update snake direction based on arrow keys
    switch (keyPressed) {
        case LEFT_KEY:
            if (dx !== GRID_SIZE) {
                dx = -GRID_SIZE;
                dy = 0;
            }
            break;
        case UP_KEY:
            if (dy !== GRID_SIZE) {
                dx = 0;
                dy = -GRID_SIZE;
            }
            break;
        case RIGHT_KEY:
            if (dx !== -GRID_SIZE) {
                dx = GRID_SIZE;
                dy = 0;
            }
            break;
        case DOWN_KEY:
            if (dy !== -GRID_SIZE) {
                dx = 0;
                dy = GRID_SIZE;
            }
            break;
    }
});
