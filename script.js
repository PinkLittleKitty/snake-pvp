const gameBoard = document.getElementById("game-board");
const gridSize = 30;
let snake1 = [{x: Math.floor(gridSize * (gameBoard.offsetWidth / gridSize - 3) / gridSize) * gridSize, y: Math.floor(gameBoard.offsetHeight / 2 / gridSize) * gridSize}];
let snake2 = [{x: Math.floor(gridSize * 3 / gridSize) * gridSize, y: Math.floor(gameBoard.offsetHeight / 2 / gridSize) * gridSize}];
let snake3 = [];
let snake4 = [];
let direction1 = "left";
let direction2 = "right";
let direction3 = "up";
let direction4 = "down";
let gameOver = false;
let snake1Speed = 200;
let snake2Speed = 200;
let snake3Speed = 200;
let snake4Speed = 200;
let snake1Score = 0;
let snake2Score = 0;
let snake3Score = 0;
let snake4Score = 0;
let numPlayers = 0;
let gameStarted = false;

let food = generateRandomFoodPosition();

const screenHeight = window.innerHeight;
const startX = Math.floor(gridSize / 2);
const startY = Math.floor(gameBoard.offsetHeight / 2 / gridSize) * gridSize;
const startBottomCenterX = Math.floor(gameBoard.offsetWidth / 2 / gridSize) * gridSize;
const startBottomCenterY = Math.floor(screenHeight / gridSize) * gridSize - gridSize;
const startTopCenterX = Math.floor(gameBoard.offsetWidth / 2 / gridSize) * gridSize;
    const startTopCenterY = gridSize;

document.getElementById("two-players").addEventListener("click", () => startGame(2));
document.getElementById("three-players").addEventListener("click", () => startGame(3));
document.getElementById("four-players").addEventListener("click", () => startGame(4));

function startGame(selectedPlayers) {
    numPlayers = selectedPlayers;
    gameStarted = true;


    snake1 = [{ x: Math.floor(gridSize * (gameBoard.offsetWidth / gridSize - 3) / gridSize) * gridSize, y: startY, class: "" }];
    snake2 = [{ x: Math.floor(gridSize * 3 / gridSize) * gridSize, y: Math.floor(gameBoard.offsetHeight / 2 / gridSize) * gridSize, class: ""}];

    if (numPlayers >= 3) {
        snake3 = [{ x: startBottomCenterX, y: startBottomCenterY, class: "" }];
    }

    if (numPlayers === 4) {
        snake4 = [{ x: startTopCenterX, y: startTopCenterY, class: "pinkHead" }];
    }


    document.getElementById("player-buttons").style.display = "none";
    document.getElementById("game-board").style.display = "block";


    gameLoop();
}


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


    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver = true;
            for (let j = i; j < snake.length; j++) {
                snake[j].class = "redBody";
            }
            snake[0].class = "redHead";
            return;
        }
    }

    for (const otherSnake of [snake1, snake2, snake3, snake4]) {
        if (otherSnake !== snake) {
            for (const segment of otherSnake) {
                if (segment.x === head.x && segment.y === head.y) {
                    gameOver = true;
                    for (let j = 0; j < snake.length; j++) {
                        snake[j].class = "redBody";
                    }
                    otherSnake[0].class = "redHead";
                    return;
                }
            }
        }
    }

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
    } else if (snake === snake2) {
        snake2Speed = Math.max(50, 200 - (score * 10));
        snake2Score = score;
    } else if (snake === snake3) {
        snake3Speed = Math.max(50, 200 - (score * 10));
        snake3Score = score;
    } else if (snake === snake4) {
        snake4Speed = Math.max(50, 200 - (score * 10));
        snake4Score = score;
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

    snake3.forEach((segment, index) => {
        drawSnakeSegment(segment, "snake3", index === 0 ? "yellowHead" : "yellowBody");
    });

    snake4.forEach((segment, index) => {
        drawSnakeSegment(segment, "snake4", index === 0 ? "pinkHead" : "pinkBody");
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
    snake1 = [{ x: Math.floor(gridSize * (gameBoard.offsetWidth / gridSize - 3) / gridSize) * gridSize, y: startY, class: "" }];
    snake2 = [{ x: Math.floor(gridSize * 3 / gridSize) * gridSize, y: Math.floor(gameBoard.offsetHeight / 2 / gridSize) * gridSize, class: ""}];

    if (numPlayers >= 3) {
        snake3 = [{ x: startBottomCenterX, y: startBottomCenterY, class: "" }];
    }

    if (numPlayers === 4) {
        snake4 = [{x: startTopCenterX, y: startTopCenterY, class: "" }];
    }

    direction1 = "left";
    direction2 = "right";
    direction3 = "up";
    direction4 = "down";
    gameOver = false;
    snake1Speed = 200;
    snake2Speed = 200;
    snake3Speed = 200;
    snake4Speed = 200;
    snake1Score = 0;
    snake2Score = 0;
    snake3Score = 0;
    snake4Scire = 0;
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
        if (numPlayers === 2) {
            updateSnake(snake1, direction1, snake1Speed, snake1Score);
            updateSnake(snake2, direction2, snake2Speed, snake2Score);
        } else if (numPlayers === 3) {
            updateSnake(snake1, direction1, snake1Speed, snake1Score);
            updateSnake(snake2, direction2, snake2Speed, snake2Score);
            updateSnake(snake3, direction3, snake3Speed, snake3Score);
        } else if (numPlayers === 4) {
            updateSnake(snake1, direction1, snake1Speed, snake1Score);
            updateSnake(snake2, direction2, snake2Speed, snake2Score);
            updateSnake(snake3, direction3, snake3Speed, snake3Score);
            updateSnake(snake4, direction4, snake4Speed, snake4Score);
        }
        draw();
        setTimeout(gameLoop, 150);
    } else {
        showGameOverScreen();
    }
}

function showGameOverScreen() {
    let whoHit = " ";
    const gameOverTextElement = document.getElementById("game-over-text");

    if (snake1[0].class === "redHead") {
        whoHit = "El Jugador Verde chocó!";
    } else if (snake2[0].class === "redHead") {
        whoHit = "El Jugador Azul chocó!";
    } else if (snake3[0].class === "redHead") {
        whoHit = "El Jugador Amarillo chocó!";
    } else if (snake4[0].class === "redHead") {
        whoHit = "El Jugador Rosa chocó!";
    }

    if (numPlayers === 2)
    {
        gameOverTextElement.textContent ="Fin del Juego - " + whoHit + "\nPuntuación del Verde: " + snake1Score + "\nPuntuación del Azul: " + snake2Score;
    } 
    else if (numPlayers === 3)
    {
        gameOverTextElement.textContent ="Fin del Juego - " + whoHit + "\nPuntuación del Verde: " + snake1Score + "\nPuntuación del Azul: " + snake2Score + "\nPuntuación del Amarillo: " + snake3Score;
    } 
    else 
    {
        gameOverTextElement.textContent ="Fin del Juego - " + whoHit + "\nPuntuación del Verde: " + snake1Score + "\nPuntuación del Azul: " + snake2Score + "\nPuntuación del Amarillo: " + snake3Score + "\nPuntuación del Rosa: " + snake4Score;
    }
    document.getElementById("game-over").style.display = "block";
    const restartButton = document.getElementById("restart-button");
    restartButton.style.display = "block";
}

//gameLoop();

document.addEventListener("keydown", (event) => {
    if (gameOver && event.key === "r") {
        restartGame();
        return;
    }

    switch (event.key) {
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
        case "i":
            if (direction3 !== "down") {
                direction3 = "up";
            }
            break;
        case "k":
            if (direction3 !== "up") {
                direction3 = "down";
            }
            break;
        case "j":
            if (direction3 !== "right") {
                direction3 = "left";
            }
            break;
        case "l":
            if (direction3 !== "left") {
                direction3 = "right";
            }
            break;
        case "8":
            if (direction4 !== "down") {
                direction4 = "up";
            }
            break;
        case "5":
            if (direction4 !== "up") {
                direction4 = "down";
            }
            break;
        case "4":
            if (direction4 !== "right") {
                direction4 = "left";
            }
            break;
        case "6":
            if (direction4 !== "left") {
                direction4 = "right";
            }
            break;
    }
});
