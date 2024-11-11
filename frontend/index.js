import { backend } from 'declarations/backend';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');
const restartButton = document.getElementById('restartButton');

const ninja = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    gravity: 0.5,
    velocity: 0,
    jumpPower: -10,
};

const pipes = [];
let score = 0;
let gameOver = false;

function drawNinja() {
    ctx.fillStyle = 'black';
    ctx.fillRect(ninja.x, ninja.y, ninja.width, ninja.height);
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
    });
}

function update() {
    if (gameOver) return;

    ninja.velocity += ninja.gravity;
    ninja.y += ninja.velocity;

    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
            scoreDisplay.textContent = score;
            createPipe();
        }

        if (detectCollision(pipe)) {
            gameOver = true;
            gameOverDisplay.style.display = 'block';
            restartButton.style.display = 'block';
          backend.set_high_score(score).then(result => {
            console.log("High score set:", result);
          }).catch(err => {
            console.error("Error setting high score:", err);
          });
        }
    });

    if (ninja.y < 0 || ninja.y + ninja.height > canvas.height) {
        gameOver = true;
        gameOverDisplay.style.display = 'block';
        restartButton.style.display = 'block';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNinja();
    drawPipes();

    requestAnimationFrame(update);
}

function createPipe() {
    const gap = 150;
    const topHeight = Math.random() * (canvas.height - gap - 100) + 50;
    const bottomY = topHeight + gap;
    const bottomHeight = canvas.height - bottomY;

    pipes.push({
        x: canvas.width,
        width: 50,
        topHeight,
        bottomY,
        bottomHeight,
    });
}

function detectCollision(pipe) {
    return (
        ninja.x < pipe.x + pipe.width &&
        ninja.x + ninja.width > pipe.x &&
        (ninja.y < pipe.topHeight || ninja.y + ninja.height > pipe.bottomY)
    );
}

function jump() {
    ninja.velocity = ninja.jumpPower;
}

document.addEventListener('keydown', jump);
restartButton.addEventListener('click', () => {
    location.reload();
});

createPipe();
createPipe();
update();

gameOverDisplay.style.display = 'none';
restartButton.style.display = 'none';

