class GameState {
    constructor(gameInfo) {

        this.currentLevel = 0;
        this.isRunning = false;

        this.gameStartScreen = true;
        this.gameOverScreen = false;
        this.gameEndingScreen = false;

        this.gameFrame = 0;
        this.loopFrame = 0;
        this.staggerFrames = 10;

    }

    updateFrames() {
        (this.loopFrame % this.staggerFrames == 0) && this.gameFrame++;
        this.loopFrame++;
    }

    increaseLevel() {
        if (this.currentLevel < 2) {
            this.currentLevel += 1;
        }
    }

    startGame() {
        this.isRunning = false;
        this.gameStartScreen = true;
        this.gameOverScreen = false;
        this.gameEndingScreen = false;
    }

    run() {
        this.isRunning = true;
        this.gameStartScreen = false;
        this.gameOverScreen = false;
        this.gameEndingScreen = false;
    }

    gameOver() {
        this.isRunning = false;
        this.gameStartScreen = false;
        this.gameOverScreen = true;
        this.gameEndingScreen = false;
    }

    endGame() {
        this.isRunning = false;
        this.gameStartScreen = false;
        this.gameOverScreen = false;
        this.gameEndingScreen = true;
    }
    
}