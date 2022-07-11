// Game Objects
const LEVEL_01 = new Level(LEVEL_01_INFO);
const URU = new Player({x: CANVAS_WIDTH / 4, y: 353}, spriteInfo);
const INPUT = new InputHandler();
const MINI_MAP = new MiniMap(LEVEL_01, URU, 0.25);
const VIEW_PORT = new Viewport(URU, LEVEL_01);

// Main Canvas (game screen)
const canvas = document.querySelector("#canvas1")
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Secondary canvas for minimap
const canvas2 = document.querySelector("#canvas2")
const minCtx = canvas2.getContext("2d");
canvas2.width = LEVEL_01.length / 4;
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

    // Update sprite animation
    URU.updateAnimation(INPUT);

    // Update player's position on the map
    URU.updatePosition(INPUT);

    // Viewport: renders tiles, player and background drawings
    VIEW_PORT.updateAnchor(URU, LEVEL_01);
    VIEW_PORT.getTiles(LEVEL_01);
    VIEW_PORT.drawBackground(URU, LEVEL_01);
    VIEW_PORT.drawTiles(LEVEL_01);
    VIEW_PORT.drawPlayer(LEVEL_01, URU, gameState.gameFrame)

    // Minimap
    minCtx.clearRect(0, 0, LEVEL_01.length/4, 480/4);
    MINI_MAP.drawSurface(LEVEL_01);
    MINI_MAP.drawPlayer(URU);

    // Show variables below the canvas
    showVariables();

    (gameState.loopFrame % gameState.staggerFrames == 0) && gameState.gameFrame++;
    gameState.loopFrame++;
    requestAnimationFrame(animate);

}

animate();

console.log("LEVEL_01");
console.log(LEVEL_01);
console.log("URU");
console.log(URU);
console.log('VIEW_PORT');
console.log(VIEW_PORT);
console.log('MINI_MAP');
console.log(MINI_MAP);