async function fetchJson(url) {
    const response = await fetch(url);
    const toReturn = JSON.parse(await response.text());
    return toReturn;
}

(async () => {
    
    const [level, sprite, monster01Info] = await Promise.all([
        fetchJson("./info/level_01_info.json"),
        fetchJson("./info/player_info.json"),
        fetchJson("./info/monster_info.json"),
    ])

    runGame(level, sprite, monster01Info);
})()

function runGame(levelInfo, spriteInfo, monster01Info) {

    // Some variables that I still don't know where to put
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const miniMapScale = 0.25;

    const gameState = {
        gameFrame: 0,
        loopFrame: 0,
        staggerFrames: 10,  
    }

    // Game Objects
    const currentLevel = new Level(levelInfo);
    const currentPlayer = new Player({x: 10, y: 10}, spriteInfo);
    const monster01 = new Monster({x: 300, y: 10}, monster01Info);
    console.log(currentPlayer)
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

        // Player: updates state, position, movement
        currentPlayer.update(input, currentLevel);
        const monsterInput = monster01.generateInput(currentLevel, currentPlayer);
        monster01.update(monsterInput, currentLevel);

        // Viewport: renders tiles, player and background drawings
        currentViewPort.update(currentLevel, currentPlayer, [monster01], gameState, context);

        // Minimap
        currentMiniMap.update(currentLevel, currentPlayer, miniContext);

        // Debugger
        showVariables("currentPlayer.state", gameState, currentPlayer.state);
        showVariables("currentViewPort", gameState, currentViewPort);

        (gameState.loopFrame % gameState.staggerFrames == 0) && gameState.gameFrame++;
        gameState.loopFrame++;
        requestAnimationFrame(animate);

    }

    animate();

    console.log("currentLevel");
    console.log(currentLevel);
    console.log("currentPlayer");
    console.log(currentPlayer);
    console.log('currentViewPort');
    console.log(currentViewPort);
    console.log('currentMiniMap');
    console.log(currentMiniMap);


}

