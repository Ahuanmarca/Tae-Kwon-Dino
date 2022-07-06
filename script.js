const canvas = document.querySelector("#canvas1");
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const gameState = {
    gameFrame:0,
    loopFrame: 0,
    staggerFrames: 10,  
}

const URU = new Player({x: CANVAS_WIDTH / 4, y: 353}, spriteInfo);
const LEVEL_01 = new Level(LEVEL_01_INFO);
const INPUT = new InputHandler();

// Select sounds from html document
const jumpStart = document.querySelector("#SNDjumpStart");
const jumpLand = document.querySelector("#SNDjumpLand");

let useUru = true;

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

    // Show variabels below the canvas
    showVariables();

    (gameState.loopFrame % gameState.staggerFrames == 0) && gameState.gameFrame++;
    gameState.loopFrame++;
    requestAnimationFrame(animate);
}

animate();
