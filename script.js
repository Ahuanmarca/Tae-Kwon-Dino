// Game Objects
const currentLevel = new Level(LEVEL_01_INFO);
const player = new Player({x: CANVAS_WIDTH / 4, y: 353}, spriteInfo);
const input = new InputHandler();
const MINI_MAP = new MiniMap(currentLevel, player, 0.25);
const viewPort = new Viewport(player, currentLevel);

// Main Canvas (game screen)
const canvas = document.querySelector("#canvas1")
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Secondary canvas for minimap
const canvas2 = document.querySelector("#canvas2")
const minCtx = canvas2.getContext("2d");
canvas2.width = currentLevel.length / 4;
canvas2.height = 480 / 4;

const gameState = {
    gameFrame:0,
    loopFrame: 0,
    staggerFrames: 10,  
}

// Select sounds from html document
const jumpStart = document.querySelector("#SNDjumpStart");
const jumpLand = document.querySelector("#SNDjumpLand");


function animate() {

    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    player.updateState(input);

    // Update sprite animation
    player.updateAnimation();

    // Update player's position on the map
    player.updatePosition(input, currentLevel);

    // Viewport: renders tiles, player and background drawings
    viewPort.updateAnchor(player, currentLevel);
    viewPort.getTiles(currentLevel);
    viewPort.drawBackground(player, currentLevel);
    viewPort.drawTiles(currentLevel);
    viewPort.drawPlayer(currentLevel, player, gameState.gameFrame)

    // Minimap
    minCtx.clearRect(0, 0, currentLevel.length/4, 480/4);
    MINI_MAP.drawSurface(currentLevel);
    MINI_MAP.drawPlayer(player);

    // Show variables below the canvas
    showVariables(currentLevel, player, input, viewPort);

    (gameState.loopFrame % gameState.staggerFrames == 0) && gameState.gameFrame++;
    gameState.loopFrame++;
    requestAnimationFrame(animate);

}

animate();

console.log("currentLevel");
console.log(currentLevel);
console.log("player");
console.log(player);
console.log('viewPort');
console.log(viewPort);
console.log('MINI_MAP');
console.log(MINI_MAP);