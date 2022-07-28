const startGame = {
    level: "./info/level_01_info.json",
    player: "./info/player_info.json",
    monsters: "./info/monsters_info.json",
}

async function fetchJson(url) {
    const response = await fetch(url);
    const result = JSON.parse(await response.text());
    return result;
}

(async () => {

    const [levelInfo, playerInfo] = await Promise.all([
        fetchJson(startGame.level),
        fetchJson(startGame.player),
    ])

    // monstersInfo is array of objects with name, properties and position
    const monsters_info = await fetchJson(startGame.monsters);
    const monstersInfo = monsters_info.monsters_info;
    for (let i = 0; i < monstersInfo.length; i++) {
        monstersInfo[i].info = await fetchJson(monstersInfo[i].url);
    }

    runGame(levelInfo, playerInfo, monstersInfo);
})()

function runGame(levelInfo, spriteInfo, monstersInfo) {

    // Some variables that I still don't know where to put
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const miniMapScale = 0.25;

    const gameState = {
        isRunning: true,
        gameFrame: 0,
        loopFrame: 0,
        staggerFrames: 10,
    }

    // Game Objects
    const currentLevel = new Level(levelInfo);
    const currentPlayer = new Player({x: 10, y: 100}, spriteInfo);

    const currentMonsters = [];
    monstersInfo.forEach(monster => {
        const tmp = new Monster(monster.position, monster.info)
        currentMonsters.push(tmp);
    })
    
    const input = new InputHandler();
    const currentMiniMap = new MiniMap(currentLevel, currentPlayer, miniMapScale);
    const currentViewPort = new Viewport(currentPlayer, currentLevel);

    // Main Canvas (game screen)
    const canvas = document.querySelector("#canvas1")
    const context = canvas.getContext("2d");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Secondary canvas for minimap
    const canvas2 = document.querySelector("#canvas2")
    const miniContext = canvas2.getContext("2d");
    canvas2.width = currentLevel.length * miniMapScale;
    canvas2.height = CANVAS_HEIGHT * miniMapScale;

    function animate() {

        context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

        if (gameState.isRunning) {
    
            // Player: updates state, position, movement
            currentPlayer.update(input, currentLevel);
            const monsterInput = currentMonsters[0].generateInput(currentLevel, currentPlayer);
            currentMonsters[0].update(monsterInput, currentLevel);
    
            // Viewport: renders tiles, player and background drawings
            currentViewPort.update(currentLevel, currentPlayer, [currentMonsters[0]], gameState, context);
    
            // Minimap
            currentMiniMap.update(currentLevel, currentPlayer, miniContext);
    
            // Debugger
            showVariables("currentPlayer.state", gameState, currentPlayer.state);
            // showVariables("currentViewPort", gameState, currentViewPort);
            // showVariables("first monster", gameState, currentMonsters[0].state);
    
            currentPlayer.state.isTakingDamage = false;
    
            for (let i = 0; i < currentMonsters.length; i++) {
                if (currentPlayer.testCollition(currentMonsters[i])) {
                    currentPlayer.state.isTakingDamage = true;
                    currentPlayer.state.currentHealth -= 1;
                }            
            }
    
            if (currentPlayer.state.currentHealth <= 0) {
                gameState.isRunning = false;
            }
            
            (gameState.loopFrame % gameState.staggerFrames == 0) && gameState.gameFrame++;
            gameState.loopFrame++;

        }

        if (!gameState.isRunning) {
            context.drawImage(
                importImage("./assets/other/game_over.png"),
                0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
            );
        }
        
        requestAnimationFrame(animate);
    }

    animate();

    console.log("currentLevel");
    console.log(currentLevel);
    console.log("currentPlayer");
    console.log(currentPlayer);
    console.log("currentMonsters");
    console.log(currentMonsters);
    console.log('currentViewPort');
    console.log(currentViewPort);
    console.log('currentMiniMap');
    console.log(currentMiniMap);


}

