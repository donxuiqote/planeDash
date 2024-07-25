const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.5;
}

resizeCanvas()
window.addEventListener('resize', resizeCanvas);




//player initialization
const playerWidth = 80;
const playerHeight = 60;
const playerSpeed = 4;
let playerX = canvas.width / 2 - playerWidth / 2;
const playerAsets = new Image();
playerAsets.src = 'Main Ship - Base - Full health.png';

function drawPlayer() {
    ctx.drawImage(playerAsets, playerX, canvas.height - playerHeight, playerWidth, playerHeight);
}

function movePlayer() {
    if (keys.ArrowLeft) {
        playerX = Math.max(0, playerX - playerSpeed);
    }
    if (keys.ArrowRight) {
        playerX = Math.min(canvas.width - playerWidth, playerX + playerSpeed);
    }
}

//bullet initialization
const bulletWidth = 30;
const bulletHeight = 30;
const bulletSpeed = 5;
const bullets = [];
const bulletAsets = new Image();
bulletAsets.src = 'Main ship weapon - Projectile - Auto cannon bullet.png';

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.drawImage(bulletAsets, bullet.x, bullet.y, bulletWidth, bulletHeight);
    });
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// enemy initialization
const enemyWidth = 80;
const enemyHeight = 60;
const enemySpeed = 2;
const enemies = [];
const enemySpawnInterval = 1500;
let lastEnemySpawnTime = 0;
const enemyAsets = new Image();
enemyAsets.src = 'Main Ship - Engines - Burst Engine.png';

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyAsets, enemy.x, enemy.y, enemyWidth, enemyHeight);
    });
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            resetGame();
        }
    });
}

function createEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - enemyWidth),
        y: -enemyHeight
    });
}

//skor
let score = 0;

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemyWidth &&
                bullet.x + bulletWidth > enemy.x &&
                bullet.y < enemy.y + enemyHeight &&
                bullet.y + bulletHeight > enemy.y) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 1;
                updateScoreDisplay();
            }
        });
    });
}

function resetGame() {
    score = 0;
    playerX = canvas.width / 2 - playerWidth / 2;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    const scoreElement = document.querySelector('.score');
    if (scoreElement) {
        scoreElement.textContent = `Score: ${score}`;
    }
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawPlayer();
    drawBullets();
    drawEnemies();
    updateBullets();
    updateEnemies();
    checkCollisions();
    
    if (timestamp - lastEnemySpawnTime > enemySpawnInterval) {
        createEnemy();
        lastEnemySpawnTime = timestamp;
    }
    
    requestAnimationFrame(gameLoop);
}

function handleShoot() {
    bullets.push({
        x: playerX + playerWidth / 2 - bulletWidth / 2,
        y: canvas.height - playerHeight - bulletHeight
    });
}

const keys = { ArrowLeft: false, ArrowRight: false };

function handleKeyDown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = true;
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = false;
    }
}

function handleShootKey(e) {
    if (e.key === ' ') {
        handleShoot();
    }
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
window.addEventListener('keydown', handleShootKey);
window.addEventListener('click', handleShoot);
window.addEventListener('touchstart', handleShoot);

requestAnimationFrame(gameLoop);
updateScoreDisplay();
