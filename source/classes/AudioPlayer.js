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

const audioFiles = {}
for (key in audioPaths) {
    audioFiles[key] = importAudio(audioPaths[key]);
}

class AudioPlayer {
    constructor(audioFiles) {
        this.audioFiles = audioFiles;
    }



}