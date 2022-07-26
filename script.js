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
    //      object with properties
    //      object with x y initial position

    // Get array with monster's information
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
    
    // const monster01 = new Monster({x: 500, y: 250}, monstersInfo);

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
        const monsterInput = currentMonsters[0].generateInput(currentLevel, currentPlayer);
        currentMonsters[0].update(monsterInput, currentLevel);

        // Viewport: renders tiles, player and background drawings
        currentViewPort.update(currentLevel, currentPlayer, [currentMonsters[0]], gameState, context);

        // Minimap
        currentMiniMap.update(currentLevel, currentPlayer, miniContext);

        // Debugger
        // showVariables("currentPlayer.state", gameState, currentPlayer.state);
        // showVariables("currentViewPort", gameState, currentViewPort);
        // showVariables("first monster", gameState, currentMonsters[0].state);

        // Enemy bites player!
        // if ((Math.floor(currentPlayer.state.x + (96-32)) >= Math.floor(currentMonsters[0].state.x)) &&
        //     (Math.floor(currentPlayer.state.x) <= Math.floor(currentMonsters[0].state.x + (96-32)))) {
        //     currentPlayer.state.isTakingDamage = true;
        // } else {
        //     currentPlayer.state.isTakingDamage = false;
        // }

        console.log(currentPlayer.testCollition(currentMonsters[0]));

        // if (currentPlayer.testCollition(currentMonsters[0])) {
        //     console.log("Bite!!");
        // }

        (gameState.loopFrame % gameState.staggerFrames == 0) && gameState.gameFrame++;
        gameState.loopFrame++;
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

