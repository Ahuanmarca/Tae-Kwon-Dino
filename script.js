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

    // monstersInfo is array of objects with
    //      monster name
    //      object literal with monster properties
    //      monster initial position

    // Get array with monster's information
    const monsters_info = await fetchJson(startGame.monsters);
    const monstersInfo = monsters_info.monsters_info;

    // console.log(monstersInfo);

    for (let i = 0; i < monstersInfo.length; i++) {
        console.log(monstersInfo[i])
        

        // monstersInfo[i][info] = await fetchJson(monsters_info[i].url);
    }

    // const monstersURLs = monsters_info.monsters_urls;
    // for (let i = 0; i < monstersURLs.length; i++) {
        // const url = monstersURLs[i];
        // const newMonster = await fetchJson(url);
        // monstersInfo.push(newMonster);
    // }

    // runGame(levelInfo, playerInfo, monstersInfo);
})()

function runGame(levelInfo, spriteInfo, monstersInfo) {

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
    const currentPlayer = new Player({x: 10, y: 100}, spriteInfo);

    const currentMonsters = [];
    monstersInfo.forEach(monster => {
        currentMonsters.push(monster);
    })
    const monster01 = new Monster({x: 500, y: 250}, monstersInfo);

    // const currentMonsters = [];
    // monstersInfo.forEach();

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
        // showVariables("currentPlayer.state", gameState, currentPlayer.state);
        // showVariables("currentViewPort", gameState, currentViewPort);
        showVariables("monster01", gameState, monster01.state);


        // Enemy bites player!
        if ((Math.floor(currentPlayer.state.x + (96-32)) >= Math.floor(monster01.state.x)) &&
            (Math.floor(currentPlayer.state.x) <= Math.floor(monster01.state.x + (96-32)))) {
            currentPlayer.state.isTakingDamage = true;
            console.log("BITE!!!");
        } else {
            currentPlayer.state.isTakingDamage = false;
        }




        (gameState.loopFrame % gameState.staggerFrames == 0) && gameState.gameFrame++;
        gameState.loopFrame++;
        requestAnimationFrame(animate);

    }

    animate();

    console.log("currentLevel");
    console.log(currentLevel);
    console.log("currentPlayer");
    console.log(currentPlayer);
    console.log("monster01");
    console.log(monster01);
    console.log('currentViewPort');
    console.log(currentViewPort);
    console.log('currentMiniMap');
    console.log(currentMiniMap);


}

