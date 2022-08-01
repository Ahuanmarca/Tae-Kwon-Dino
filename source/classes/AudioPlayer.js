const audioPaths = {

    // Music
    gameStartScreen: `../../assets/music/gameStart_expansion.ogg`,
    gameOverScreen: `../../assets/music/gameOver_melodicGameOver.wav`,
    gameEndingScreen: `../../assets/music/gameEnding_joyful.ogg`,
    level_01: `../../assets/music/level01_exploration.ogg`,
    level_02: `../../assets/music/level02_GoingUp.ogg`,
    level_03: `../../assets/music/level03_fantasyDragon.ogg`,

    // Sound FX
    jumpStart: `../../assets/sfx/tinysized/jumpStart.wav`,
    jumpLand: `../../assets/sfx/tinysized/jumpLand.wav`,
    bite: `../../assets/sfx/tinysized/bite.wav`,
    tailAttack: `../../assets/sfx/tinysized/tailAttack.wav`,
    falling: `../../assets/sfx/mixkit/mixkit-short-whistle-fall-406.wav`,
    fallingHitBottom: `../../assets/sfx/mixkit/mixkit-falling-hit-on-gravel-756.wav`,
    powerUp1: `../../assets/sfx/gfx/Arcade-8-bit-power-up-674.wav`,
    powerUp2: `../../assets/sfx/gfx/Game-spring-bounce-or-jump-781.wav`,
    killMonster: `../../assets/sfx/gfx/Retro-8-bit-damage-571.wav`,
}

// const audioFiles = {}
// for (key in audioPaths) {
//     audioFiles[key] = importAudio(audioPaths[key]);
// }

class AudioPlayer {
    constructor() {

        this.isActive = true;

        this.currentTrack = { // can contain only booleans
            none: true,
            gameStartScreen: false,
            gameOverScreen: false,
            gameEndingScreen: false,
            level01: false,
            level02: false,
            level03: false,
        }

        this.music = {
            gameStartScreen: importAudio(audioPaths.gameStartScreen),
            gameOverScreen: importAudio(audioPaths.gameOverScreen),
            gameEndingScreen: importAudio(audioPaths.gameEndingScreen),
            level_01: importAudio(audioPaths.level_01),
            level_02: importAudio(audioPaths.level_02),
            level_03: importAudio(audioPaths.level_03),
        }

        this.sfx = {
            jumpStart: importAudio(audioPaths.jumpStart),
            jumpLand: importAudio(audioPaths.jumpLand),
            bite: importAudio(audioPaths.bite),
            tailAttack: importAudio(audioPaths.tailAttack),
            falling: importAudio(audioPaths.falling),
            fallingHitBottom: importAudio(audioPaths.fallingHitBottom),
            powerUp1: importAudio(audioPaths.powerUp1),
            powerUp2: importAudio(audioPaths.powerUp2),
            killMonster: importAudio(audioPaths.killMonster),
        }

        this.gameState = {
            old: undefined,
            new: undefined,
        }

        this.playerState = {
            old: undefined,
            new: undefined,
        }
    }

    update(currentPlayer) {
        this.updatePlayerState(currentPlayer);
        this.isActive && this.playPlayerSounds();
    }

    updatePlayerState(currentPlayer) {
        this.playerState.old = Object.assign({}, this.playerState.new);
        this.playerState.new = Object.assign({}, currentPlayer.state);
    }

    // takes object with two equal dictionaries, compares bolleans
    // and returns array with keys that turned from false to true
    detectBooleanChanges(twoStates) {
        const turnedTrue = [];
        if (twoStates.old && twoStates.new) {

            for (let key in twoStates.new) {
                if (!twoStates.old[key] && twoStates.new[key]) {
                    typeof twoStates.old[key] === "boolean" && turnedTrue.push(key);
                }
            }
        }
        return turnedTrue;
    }

    playPlayerSounds() {
        const newActions = this.detectBooleanChanges(this.playerState);

        // Play the sounds!
        newActions.indexOf("isJumping") != -1 && this.sfx.jumpStart.play();
        newActions.indexOf("isGrounded") != -1 && this.sfx.jumpLand.play();
    }





    updateGameState(gameState) { // ! Not yet in use
        this.gameState.old = Object.assign({}, this.gameState.new);
        this.gameState.new = Object.assign({}, gameState);
    }

    // accepts dictionary that has only booleans
    // toTrue is key of property that will become true, others will become false
    toggleBooleans(toTrue) { // ! To switch current track, not yet in use
        for (let key in this.currentTrack) {
            this.currentTrack[key] = key === toTrue;
        }
    }
}