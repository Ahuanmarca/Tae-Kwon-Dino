import {importAudio} from "../helpers/importAudio.js"

const audioPaths = {

    // Music
    onTitle: `../../assets/music/gameStart_expansion.ogg`,
    onGameOver: `../../assets/music/gameOver_melodicGameOver.wav`,
    onGameEnding: `../../assets/music/gameEnding_joyful.ogg`,
    level01: `../../assets/music/level01_exploration.ogg`,
    level02: `../../assets/music/level02_GoingUp.ogg`,
    level03: `../../assets/music/level03_fantasyDragon.ogg`,

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


export class AudioPlayer {
    constructor() {

        this.isActive = true;

        this.currentTrack = { // can contain only booleans
            none: true,
            onTitle: false,
            onGameOver: false,
            onGameEnding: false,
            level01: false,
            level02: false,
            level03: false,
        }

        this.music = {
            onTitle: importAudio(audioPaths.onTitle),
            onGameOver: importAudio(audioPaths.onGameOver),
            onGameEnding: importAudio(audioPaths.onGameEnding),
            level01: importAudio(audioPaths.level01),
            level02: importAudio(audioPaths.level02),
            level03: importAudio(audioPaths.level03),
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

    update(currentPlayer, gameState) {
        this.updatePlayerState(currentPlayer);
        this.isActive && this.playPlayerSounds(currentPlayer);
        this.updateCurrentTrack(gameState);
        this.playGameMusic();
        // this.updateGameState(gameState);
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

    playPlayerSounds(currentPlayer) {
        const newActions = this.detectBooleanChanges(this.playerState);

        // Play the sounds!

        // Sounds played only when the state changes from false to true
        newActions.indexOf("isJumping") != -1 && this.sfx.jumpStart.play();
        newActions.indexOf("isGrounded") != -1 && this.sfx.jumpLand.play();

        // Sounds played when some condition is true
        currentPlayer.state.isTakingDamage && this.sfx.bite.play();

        // Checking range to avoid looping sound
        // TODO Find a better way?
        if (currentPlayer.state.y > 480 && currentPlayer.state.y < 600) {
            this.sfx.falling.play();
            setTimeout(() => {
                this.sfx.fallingHitBottom.play();
            }, 1000)
        }
    }

    // updateGameState(gameState) { // ! Not yet in use
    //     this.gameState.old = Object.assign({}, this.gameState.new);
    //     this.gameState.new = Object.assign({}, gameState);
    // }


    updateCurrentTrack(gameState) {
        gameState.currentLevel === 0 && this.toggleBooleans("level01");
        gameState.currentLevel === 1 && this.toggleBooleans("level02");
        gameState.currentLevel === 2 && this.toggleBooleans("level03");
        gameState.onTitle && this.toggleBooleans("onTitle");
        gameState.onGameOver && this.toggleBooleans("onGameOver");
        gameState.onGameEnding && this.toggleBooleans("onGameEnding");
        gameState.onTransition && this.toggleBooleans("onTransition");
    }

    playGameMusic() {

        // ! Problem
        // Music loops. That's ok most of the time, but is wrong for game over.
        // Maybe consider that music as a sound FX instead?
        // TODO... fix the problem!

        // TODO
        // I want the music to have a little delay after starting
        // Can't use setTimeout here because it will interrupt the loop
        // I think I need to start playin the music exactly when the state changes,
        // ...then keep playing it when the state stays the same...

        for (let key in this.currentTrack) {

            if (this.currentTrack[key]) {
                this.music[key].play();
            } else {
                this.music[key] && this.music[key].pause();
            }

        }
    }



    // accepts dictionary that has only booleans
    // toTrue is key of property that will become true, others will become false
    toggleBooleans(toTrue) { // ! To switch current track, not yet in use
        for (let key in this.currentTrack) {
            this.currentTrack[key] = key === toTrue;
        }
    }
}
