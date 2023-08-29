const gameBoard = document.getElementById("game-board");
const gridSize = 30;
let snake1 = [{x: Math.floor(gridSize * 3 / gridSize) * gridSize, y: Math.floor(gameBoard.offsetHeight / 2 / gridSize) * gridSize}];
let snake2 = [{x: Math.floor(gridSize * (gameBoard.offsetWidth / gridSize - 3) / gridSize) * gridSize, y: Math.floor(gameBoard.offsetHeight / 2 / gridSize) * gridSize}];
let direction1 = "left";
let direction2 = "right";
let gameOver = false;
let snake1Speed = 200;
let snake2Speed = 200;
let snake1Score = 0;
let snake2Score = 0;

let food = generateRandomFoodPosition();

function generateRandomFoodPosition() {
    const maxX = Math.floor(gameBoard.offsetWidth / gridSize);
    const maxY = Math.floor(gameBoard.offsetHeight / gridSize);

    return {
        x: Math.floor(Math.random() * maxX) * gridSize,
        y: Math.floor(Math.random() * maxY) * gridSize
    };
}

function generateFood() {
    food = generateRandomFoodPosition();
}


function checkCollision(snake) {
    const head = snake[0];

    // Checkear colisión con el cuerpo de la serpiente
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver = true;
            for (let j = i; j < snake.length; j++) {
                snake[j].class = "redBody";
            }
            snake[0].class = "redHead";
        }
    }

    const otherSnake = snake === snake1 ? snake2 : snake1;
    for (const segment of otherSnake) {
        if (segment.x === head.x && segment.y === head.y) {
            gameOver = true;
            for (let j = 0; j < snake.length; j++) {
                snake[j].class = "redBody";
            }
            otherSnake[0].class = "redHead";
        }
    }

    // Checkear colisión con el borde
    if (head.x < 0 || head.x >= gameBoard.offsetWidth || head.y < 0 || head.y >= gameBoard.offsetHeight) {
        gameOver = true;
        for (let j = 0; j < snake.length; j++) {
            snake[j].class = "redBody";
        }
        snake[0].class = "redHead";
    }
}

function updateSnake(snake, direction, speed, score) {
    if (gameOver) {
        return;
    }
    
    const head = {...snake[0]};
    switch(direction) {
        case "up":
            head.y -= gridSize;
            break;
        case "down":
            head.y += gridSize;
            break;
        case "left":
            head.x -= gridSize;
            break;
        case "right":
            head.x += gridSize;
            break;
    }
    
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        generateFood();
        increaseSpeedAndScore(snake, score);
    } else {
        snake.pop();
    }

    checkCollision(snake);
}

function increaseSpeedAndScore(snake, score) {
    score++;
    if (snake === snake1) {
        snake1Speed = Math.max(50, 200 - (score * 10));
        snake1Score = score;
    } else {
        snake2Speed = Math.max(50, 200 - (score * 10));
        snake2Score = score;
    }
}

function draw() {
    gameBoard.innerHTML = "";
    snake1.forEach((segment, index) => {
        drawSnakeSegment(segment, "snake1", index === 0 ? "greenHead" : "greenBody");
    });

    snake2.forEach((segment, index) => {
        drawSnakeSegment(segment, "snake2", index === 0 ? "blueHead" : "blueBody");
    });

    const foodElement = document.createElement("div");
    foodElement.className = "food";
    foodElement.style.left = food.x + "px";
    foodElement.style.top = food.y + "px";
    gameBoard.appendChild(foodElement);
    drawGridLines();
}

document.getElementById("restart-button").addEventListener("click", restartGame);

function restartGame() {
   let snake1 = [{x: Math.floor(gridSize * 3 / gridSize) * gridSize, y: Math.floor(gameBoard.offsetHeight / 2 / gridSize) * gridSize}];
let snake2 = [{x: Math.floor(gridSize * (gameBoard.offsetWidth / gridSize - 3) / gridSize) * gridSize, y: Math.floor(gameBoard.offsetHeight / 2 / gridSize) * gridSize}];
    direction1 = "left";
    direction2 = "right";
    gameOver = false;
    snake1Speed = 200;
    snake2Speed = 200;
    snake1Score = 0;
    snake2Score = 0;
    generateFood();
    hideGameOverScreen();
    gameLoop();
}

function hideGameOverScreen() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("restart-button").style.display = "none";
}

function drawGridLines() {
    const gridLinesX = document.getElementById("grid-lines-x");
    const gridLinesY = document.getElementById("grid-lines-y");

    gridLinesX.innerHTML = "";
    gridLinesY.innerHTML = "";

    for (let x = 0; x <= gameBoard.offsetWidth; x += gridSize) {
        const gridLine = document.createElement("div");
        gridLine.className = "grid-line";
        gridLine.style.width = "1px";
        gridLine.style.height = gameBoard.offsetHeight + "px";
        gridLine.style.left = x + "px";
        gridLinesX.appendChild(gridLine);
    }

    for (let y = 0; y <= gameBoard.offsetHeight; y += gridSize) {
        const gridLine = document.createElement("div");
        gridLine.className = "grid-line";
        gridLine.style.width = gameBoard.offsetWidth + "px";
        gridLine.style.height = "1px";
        gridLine.style.top = y + "px";
        gridLinesY.appendChild(gridLine);
    }
}

function drawSnakeSegment(segment, className, imageClass) {
    const snakeSegment = document.createElement("div");
    snakeSegment.className = "snake " + className + " " + imageClass + " " + segment.class;
    snakeSegment.style.left = segment.x + "px";
    snakeSegment.style.top = segment.y + "px";
    gameBoard.appendChild(snakeSegment);
}

function gameLoop() {
    if (!gameOver) {
        updateSnake(snake1, direction1, snake1Speed, snake1Score);
        updateSnake(snake2, direction2, snake2Speed, snake2Score);
        draw();
        setTimeout(gameLoop, 150);
    } else {
        showGameOverScreen();
    }
}

function showGameOverScreen() {
    const gameOverTextElement = document.getElementById("game-over-text");
    gameOverTextElement.textContent = "Fin del Juego!\nPuntuación del Verde: " + snake1Score + "\nPuntuación del Azul: " + snake2Score;
    document.getElementById("game-over").style.display = "block";
    const restartButton = document.getElementById("restart-button");
    restartButton.style.display = "block";
}

gameLoop();

document.addEventListener("keydown", (event) => {
    switch(event.key) {
        case "ArrowUp":
            if (direction1 !== "down") {
                direction1 = "up";
            }
            break;
        case "ArrowDown":
            if (direction1 !== "up") {
                direction1 = "down";
            }
            break;
        case "ArrowLeft":
            if (direction1 !== "right") {
                direction1 = "left";
            }
            break;
        case "ArrowRight":
            if (direction1 !== "left") {
                direction1 = "right";
            }
            break;
        case "w":
            if (direction2 !== "down") {
                direction2 = "up";
            }
            break;
        case "s":
            if (direction2 !== "up") {
                direction2 = "down";
            }
            break;
        case "a":
            if (direction2 !== "right") {
                direction2 = "left";
            }
            break;
        case "d":
            if (direction2 !== "left") {
                direction2 = "right";
            }
            break;
    }
});
