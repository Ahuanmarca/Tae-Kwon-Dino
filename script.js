const levelPaths = {
    _01: "./info/level_01_info.json",
    _02: "./info/level_02_info.json",
    _03: "./info/level_03_info.json"
}

const startGame = {
    level: levelPaths._01,
    player: "./info/player_info.json",
    monsters: "./info/monsters_info.json",
}

async function fetchJson(url) {
    const response = await fetch(url);
    const result = JSON.parse(await response.text());
    return result;
}

(async () => {

    const [playerInfo] = await Promise.all([
        fetchJson(startGame.player),
    ])

    const levelsInfo = [];
    levelsInfo.push(await fetchJson(levelPaths._01));
    levelsInfo.push(await fetchJson(levelPaths._02));
    levelsInfo.push(await fetchJson(levelPaths._03));
    console.log(levelsInfo);

    // monstersInfo is array of objects with name, properties and position
    const monsters_info = await fetchJson(startGame.monsters);
    const monstersInfo = monsters_info.monsters_info;
    for (let i = 0; i < monstersInfo.length; i++) {
        monstersInfo[i].info = await fetchJson(monstersInfo[i].url);
    }

    runGame(levelsInfo, playerInfo, monstersInfo);
})()

function runGame(levelsInfo, spriteInfo, monstersInfo) {

    // Some variables that I still don't know where to put
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const miniMapScale = 0.25;

    const levels = [];
    levelsInfo.forEach(levelInfo => {
        levels.push(new Level(levelInfo));
    })


    /*
    █▀▀ ▄▀█ █▀▄▀█ █▀▀   █▀ ▀█▀ ▄▀█ ▀█▀ █▀▀
    █▄█ █▀█ █░▀░█ ██▄   ▄█ ░█░ █▀█ ░█░ ██▄ */

    // TODO Create a gameState class with methods to update
    const gameState = {
        currentLevel: 0,
        isRunning: false,

        startScreen: true,
        gameOver: false,
        youWin: false,
        
        gameFrame: 0,
        loopFrame: 0,
        staggerFrames: 10,
    }


    /*
    █▀▀ ▄▀█ █▀▄▀█ █▀▀   █▀█ █▄▄ ░░█ █▀▀ █▀▀ ▀█▀ █▀
    █▄█ █▀█ █░▀░█ ██▄   █▄█ █▄█ █▄█ ██▄ █▄▄ ░█░ ▄█ */

    // Game Objects
    const currentPlayer = new Player({x: 40, y: 100}, spriteInfo);

    const currentMonsters = [];
    monstersInfo.forEach(monster => {
        const tmp = new Monster(monster.position, monster.info)
        currentMonsters.push(tmp);
    })
    
    const input = new InputHandler();
    const currentMiniMap = new MiniMap(levels[gameState.currentLevel], currentPlayer, miniMapScale);
    const currentViewPort = new Viewport(currentPlayer, levels[gameState.currentLevel]);


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

        if (gameState.isRunning) {
    
            // Player: updates state, position, movement
            currentPlayer.update(input, levels[gameState.currentLevel]);

            // Monsters behaviours
            currentMonsters.forEach(currentMonster => {
                currentMonster.update(currentMonster.generateInput(levels[gameState.currentLevel], currentPlayer), levels[gameState.currentLevel]);
            });

            // Viewport: renders tiles, player and background drawings
            currentViewPort.update(levels[gameState.currentLevel], currentPlayer, currentMonsters, gameState, context);
    
            // Minimap
            currentMiniMap.update(levels[gameState.currentLevel], currentPlayer, miniContext);
    
            // Debugger
            showVariables("currentPlayer.state", gameState, currentPlayer.state);
            showVariables("currentViewPort", gameState, currentViewPort);
    
            currentPlayer.state.isTakingDamage = false;
    
            for (let i = 0; i < currentMonsters.length; i++) {
                if (currentPlayer.testCollition(currentMonsters[i])) {
                    currentPlayer.state.isTakingDamage = true;
                    currentPlayer.state.currentHealth -= 1;
                }            
            }
    
            if (currentPlayer.state.currentHealth <= 0) {
                gameState.startScreen = false;
                gameState.isRunning = false;
                gameState.gameOver = true;
                gameState.youWin = false;
            }

            if (currentPlayer.state.x >= levels[gameState.currentLevel].length - currentPlayer.metadata.spriteWidth - 16) { // TODO clean hardcoded value

                if (gameState.currentLevel < 2) {
                    gameState.currentLevel += 1;
                    currentPlayer.state.x = 40; // TODO Refactor
                    currentMonsters[0].state.x = 400; // TODO Refactor
                    // TODO Unwrap the level data. Level data structured to an initialized state.
                } else {
                    gameState.startScreen = false;
                    gameState.isRunning = false;
                    gameState.gameOver = false;
                    gameState.youWin = true;
                }
            }

            (gameState.loopFrame % gameState.staggerFrames == 0) && gameState.gameFrame++;
            gameState.loopFrame++;

        }

        // TODO Create a gameState Class, with methods that update the state
        // TODO Need some function to restore the initial state of the levels

        if (gameState.startScreen) {
            context.drawImage(
                importImage("./assets/other/start_game.png"),
                0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
            );

            if (input.keysDict.KeyQty > 0) {
                gameState.startScreen = false;
                gameState.isRunning = true;
                gameState.gameOver = false;
                gameState.youWin = false;

            }
        }

        if (gameState.gameOver) {
            context.drawImage(
                importImage("./assets/other/game_over.png"),
                0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
            );
            if (input.keysDict.KeyQty > 0) {
                gameState.startScreen = true;
                gameState.isRunning = false;
                gameState.gameOver = false;
                gameState.youWin = false;
                currentPlayer.state.x = 40; // TODO Refactor
                currentPlayer.state.currentHealth = 50; // TODO Refactor
                currentMonsters[0].state.x = 400; // TODO Refactor
            }
        }
        
        if (gameState.youWin) {
            context.drawImage(
                importImage("./assets/other/game_ending.png"),
                0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
            );
            // if (input.keysDict.KeyQty > 0) {
            //     gameState.startScreen = true;
            //     gameState.isRunning = false;
            //     gameState.gameOver = false;
            //     gameState.youWin = false;
            //     currentPlayer.state.x = 40; // TODO Refactor
            //     currentPlayer.state.currentHealth = 50; // TODO Refactor
            //     currentMonsters[0].state.x = 400; // TODO Refactor
            // }
        }

        requestAnimationFrame(animate);
    }

    animate();

    console.log("currentLevel", levels[gameState.currentLevel]);
    console.log("currentPlayer", currentPlayer);
    console.log("currentMonsters", currentMonsters);
    console.log('currentViewPort', currentViewPort);
    console.log('currentMiniMap', currentMiniMap);


}

