import { Player } from './source/classes/Characters.js'
import { GameState } from './source/classes/GameState.js'
import { Level } from './source/classes/Level.js'
import { InputHandler } from './source/classes/InputHandler.js'
import { MiniMap } from './source/classes/MiniMap.js'
import { Viewport } from './source/classes/ViewPort.js'
import { AudioPlayer } from './source/classes/AudioPlayer.js'

import { importImage } from './source/helpers/importImage.js'
import { getMonsters } from './source/helpers/getMonsters.js'
import { showVariables } from './source/helpers/showVariables.js'
import { resetLevel } from './source/helpers/resetLevel.js'
import { fakeKeypress } from './source/helpers/fakeKeypress.js'

/*
    ╭━━━━╮╱╱╱╱╱╭╮╭━╮╱╱╱╱╱╱╱╱╱╱╭━━━╮
    ┃╭╮╭╮┃╱╱╱╱╱┃┃┃╭╯╱╱╱╱╱╱╱╱╱╱╰╮╭╮┃
    ╰╯┃┃┣┻━┳━━╮┃╰╯╋╮╭╮╭┳━━┳━╮╱╱┃┃┃┣┳━╮╭━━╮
    ╱╱┃┃┃╭╮┃┃━┫┃╭╮┃╰╯╰╯┃╭╮┃╭╮╮╱┃┃┃┣┫╭╮┫╭╮┃
    ╱╱┃┃┃╭╮┃┃━┫┃┃┃╰╮╭╮╭┫╰╯┃┃┃┃╭╯╰╯┃┃┃┃┃╰╯┃
    ╱╱╰╯╰╯╰┻━━╯╰╯╰━┻╯╰╯╰━━┻╯╰╯╰━━━┻┻╯╰┻━━╯*/

async function fetchJson(url) {
    const response = await fetch(url);
    const result = JSON.parse(await response.text());
    return result;
}

async function unpackToArray(arrPack) {
    const unpaArra = [];
    for (let i = 0; i < arrPack.length; i++) {
        unpaArra.push(await fetchJson(arrPack[i]));
    }
    return unpaArra;
}

async function unpackToDict(arrPack) {
    const unpaDict = {};
    for (let i = 0; i < arrPack.length; i++) {
        const dictItem = await fetchJson(arrPack[i]);
        const dicKey = dictItem.metadata.name;
        unpaDict[dicKey] = dictItem;
    }
    return unpaDict;
}

(async () => {
    const gameInfo = await fetchJson("./info/gameInfo.json"); // <<<====== Config file

    const levelsInfo = await unpackToArray(gameInfo.levelsInfo);
    const playerInfo = await fetchJson(gameInfo.playerInfo);

    const monstersInfo = await unpackToDict(gameInfo.monstersInfo);

    const startingStates = await fetchJson(gameInfo.startingStates);

    // startingStates go with levelsInfo items
    for (let i = 0; i < levelsInfo.length; i++) {
        levelsInfo[i].startingState = startingStates[i];
    }

    runGame(levelsInfo, playerInfo, monstersInfo);
})()

function runGame(levelsInfo, spriteInfo, monstersInfo) {

    // Some variables that I still don't know where to put
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const miniMapScale = 0.25;

    /*
    █▀▀ ▄▀█ █▀▄▀█ █▀▀   █▀█ █▄▄ ░░█ █▀▀ █▀▀ ▀█▀ █▀
    █▄█ █▀█ █░▀░█ ██▄   █▄█ █▄█ █▄█ ██▄ █▄▄ ░█░ ▄█ */
    // Game Objects

    const gameState = new GameState("Tae Kwon Dino");

    const levels = [];
    levelsInfo.forEach(levelInfo => {
        const tmpLev = new Level(levelInfo);
        // tmpLev.monsters = getMonsters(tmpLev.startingState, monstersInfo);
        levels.push(tmpLev);
    })

    const currentPlayer = new Player({x: 40, y: 100}, spriteInfo); // TODO rename spriteInfo

    // TODO Go back to creating different monsters for each level
    const currentMonsters = getMonsters(levels[0].startingState, monstersInfo);    
    // console.log(currentMonsters);

    // let currentMonsters = levels[gameState.currentLevel].monsters;

    const input = new InputHandler();
    const currentMiniMap = new MiniMap(levels[gameState.currentLevel], currentPlayer, miniMapScale);
    const currentViewPort = new Viewport(levels[gameState.currentLevel], currentPlayer);

    const audioPlayer = new AudioPlayer();

    /*
    █▀▀ ▄▀█ █▄░█ █░█ ▄▀█ █▀
    █▄▄ █▀█ █░▀█ ▀▄▀ █▀█ ▄█ */

    // Main Canvas (game screen)
    const canvas = document.querySelector("#canvas1")
    const context = canvas.getContext("2d");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Secondary canvas for minimap
    const canvas2 = document.querySelector("#canvas2")
    const miniContext = canvas2.getContext("2d");
    canvas2.width = levels[gameState.currentLevel].length * miniMapScale;
    canvas2.height = CANVAS_HEIGHT * miniMapScale;


    /*
    █▀▀ ▄▀█ █▀▄▀█ █▀▀   █░░ █▀█ █▀█ █▀█
    █▄█ █▀█ █░▀░█ ██▄   █▄▄ █▄█ █▄█ █▀▀ */

    function animate() {

        context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

        if (gameState.isActive) {

            // Player: updates state, position, movement
            currentPlayer.update(input, levels[gameState.currentLevel], currentMonsters);

            // Monsters behaviours
            currentMonsters.forEach(currentMonster => {
                currentMonster.update(currentMonster.generateInput(levels[gameState.currentLevel], currentPlayer), levels[gameState.currentLevel]);
            });

            // Viewport: renders tiles, player and background drawings
            currentViewPort.update(levels[gameState.currentLevel], currentPlayer, currentMonsters, gameState, context);

            // Minimap
            currentMiniMap.update(levels[gameState.currentLevel], currentPlayer, currentMonsters, miniContext);

            // currentPlayer.state.isTakingDamage = false;

            // Trigger game over screen
            if (currentPlayer.state.currentHealth <= 0) {
                gameState.setState.onGameOver();
            }

            // Go to next level
            if (currentPlayer.state.x >= levels[gameState.currentLevel].length - currentPlayer.metadata.spriteWidth - 16) { // TODO hardcoded
                gameState.increaseLevel();
                resetLevel(levels[gameState.currentLevel], currentPlayer)
            }

        }

        // Start Screen
        if (gameState.onTitle) {
            context.drawImage(
                importImage("./assets/other/start_game.png"),
                0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
            );

            if (input.keysDict.KeyQty > 0) {
                gameState.setState.isActive();
            }
        }

        // Game Over Screen
        if (gameState.onGameOver) {
            context.drawImage(
                importImage("./assets/other/game_over.png"),
                0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
            );
        }

        // Game Ending Screen
        if (gameState.onGameEnding) {
            context.drawImage(
                importImage("./assets/other/game_ending.png"),
                0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
            );
        }

        // Audio Player
        audioPlayer.update(currentPlayer, gameState);

        // Debugger
        showVariables("playerState", gameState, currentPlayer.state);
        showVariables("monster01", gameState, currentMonsters[0].state);
        showVariables("gameState", gameState, gameState);
        // showVariables("currentViewPort", gameState, currentViewPort);
        // console.log(gameState.isActive);

        gameState.updateFrames();
        requestAnimationFrame(animate);
    }

    animate();

    console.log("currentLevel", levels[gameState.currentLevel]);
    // console.log("currentPlayer", currentPlayer);
    // console.log("currentMonsters", currentMonsters);
    // console.log('currentViewPort', currentViewPort);
    // console.log('currentMiniMap', currentMiniMap);

}
