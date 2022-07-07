// ! Not sure about the order of declaration, switched them around a little bit because of some declarations that were needed


// Game Objects
const LEVEL_01 = new Level(LEVEL_01_INFO);
const URU = new Player({x: CANVAS_WIDTH / 4, y: 353}, spriteInfo);
const INPUT = new InputHandler();
const MINI_MAP = new MiniMap(LEVEL_01, URU, 0.25)

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

    // ------------------------------
    // WICH KEYS ARE BEING PRESSED ??
    // ------------------------------
    const KeyQty = INPUT.keys.length;
    const Shift = INPUT.keys.includes("Shift");
    const ArrowRight = INPUT.keys.includes("ArrowRight");
    const ArrowLeft = INPUT.keys.includes("ArrowLeft");
    const ArrowUp = INPUT.keys.includes("ArrowUp");
    const ArorwDown = INPUT.keys.includes("ArrowDown");


    // ------------------------------
    // UDDATE THE SPRITE ANIMATION !! -- USING CLASS !!
    // ------------------------------

    // Idle ?
    if (!ArrowLeft && !ArrowRight && !ArrowUp) URU.set.action.idle();

    // Jumping ?
    URU.state.jumping = (URU.state.y != URU.state.groundPosition) ? true : false;
    if (URU.state.jumping) {
        URU.set.action.jump();
    }

    // Running ?
    if (Shift && ArrowLeft && !URU.state.jumping) {
        URU.set.action.run();
        URU.set.direction.left();
    }
    if (Shift && ArrowRight && !URU.state.jumping) {
        URU.set.action.run();
        URU.set.direction.right();
    }
    
    // Walking ?
    if (KeyQty === 1 && !URU.state.jumping) {
        if (Shift) URU.set.action.idle();
        if (ArrowRight) {
            URU.set.action.walk();
            URU.set.direction.right();
        }       
        if (ArrowLeft) {
            URU.set.action.walk();
            URU.set.direction.left();
        }
    }

    // -------------------------------------------
    // UPDATE CHARACTER'S POSITION ON THE WORLD!! -- USING CLASS !!
    // -------------------------------------------

    URU.updateVelocityX(ArrowRight, ArrowLeft, Shift);
    URU.updateVelocityY(ArrowUp);
    URU.horizontalMovement();
    URU.verticalMovement();
    URU.applyGrativy(forces.gravity);
    URU.horizontalFriction(forces.friction.horizontal);
    URU.verticalFriction(forces.friction.vertical);
    URU.applyFloorLimit();

    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    // Background layers update and draw themselves 😀
    LEVEL_01.background.updateLayers(URU.state.velocityX);

    // Player class draws itself 😀
    URU.draw(gameState.gameFrame);

    URU.getGroundLevel();
    URU.applyGravity_NEW();

    URU.drawBox();

    minCtx.clearRect(0,0,LEVEL_01.width,480/4);
    MINI_MAP.drawSurface(LEVEL_01);
    MINI_MAP.drawPlayer();

    // Show variabels below the canvas
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
