document.addEventListener('DOMContentLoaded', (event) => {
    const car = document.getElementById('car');
    const obstacle1 = document.getElementById('obstacle');
    const obstacle2 = document.getElementById('obstacle2');
    const gameContainer = document.querySelector('.game-container');
    const scoreDisplay = document.getElementById('score');
    const gameOverScreen = document.getElementById('gameOver');

    let carPosition = {
        left: gameContainer.offsetWidth / 2 - car.offsetWidth / 2,
        bottom: 20
    };

    let obstaclePositions = [
        { top: 0, left: Math.random() * (gameContainer.offsetWidth - obstacle1.offsetWidth) },
        { top: -100, left: Math.random() * (gameContainer.offsetWidth - obstacle2.offsetWidth) }
    ];

    let gameInterval;
    let isGameRunning = false;
    let score = 0;
    let isPaused = false;

    function moveCarLeft() {
        if (carPosition.left > 0) {
            carPosition.left -= 10;
            car.style.left = `${carPosition.left}px`;
        }
    }

    function moveCarRight() {
        if (carPosition.left < gameContainer.offsetWidth - car.offsetWidth) {
            carPosition.left += 10;
            car.style.left = `${carPosition.left}px`;
        }
    }

    function startGame() {
        if (!isGameRunning) {
            isGameRunning = true;
            isPaused = false;
            document.addEventListener('keydown', handleKeyPress);
            gameInterval = setInterval(updateGame, 20);
        }
    }

    function stopGame() {
        if (isGameRunning) {
            isGameRunning = false;
            clearInterval(gameInterval);
            document.removeEventListener('keydown', handleKeyPress);
            gameOverScreen.style.display = 'block';
        }
    }

    function pauseGame() {
        if (isGameRunning) {
            isPaused = !isPaused;
            if (isPaused) {
                clearInterval(gameInterval);
            } else {
                gameInterval = setInterval(updateGame, 20);
            }
        }
    }

    function handleKeyPress(e) {
        if (e.key === 'ArrowLeft') {
            moveCarLeft();
        }
        if (e.key === 'ArrowRight') {
            moveCarRight();
        }
    }

    function updateGame() {
        if (isPaused) return;

        obstaclePositions.forEach((pos, index) => {
            pos.top += 5 + (index * 2); // Different speeds for obstacles
            if (pos.top > gameContainer.offsetHeight) {
                pos.top = -50;
                pos.left = Math.random() * (gameContainer.offsetWidth - (index === 0 ? obstacle1.offsetWidth : obstacle2.offsetWidth));
            }
            (index === 0 ? obstacle1 : obstacle2).style.top = `${pos.top}px`;
            (index === 0 ? obstacle1 : obstacle2).style.left = `${pos.left}px`;
        });

        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;

        checkCollision();
    }

    function checkCollision() {
        const carRect = car.getBoundingClientRect();
        const obstacles = [obstacle1, obstacle2];
        
        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            if (
                carRect.left < obstacleRect.left + obstacleRect.width &&
                carRect.left + carRect.width > obstacleRect.left &&
                carRect.top < obstacleRect.top + obstacleRect.height &&
                carRect.top + carRect.height > obstacleRect.top
            ) {
                stopGame();
            }
        });
    }

    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('stopButton').addEventListener('click', stopGame);
    document.getElementById('pauseButton').addEventListener('click', pauseGame);
    document.getElementById('moveLeftButton').addEventListener('click', moveCarLeft);
    document.getElementById('moveRightButton').addEventListener('click', moveCarRight);
    document.getElementById('restartButton').addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        startGame();
    });
});
