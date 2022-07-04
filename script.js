const canvas = document.querySelector("#canvas1");
const context = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

/*
    Game State:     states/gameState.js
    Info:           info/...
    Classes:        classes /...
*/

// Create instance of Player Class for main character
const URU = new Player({x: CANVAS_WIDTH / 4, y: 353}, spriteInfo);

// Create instance of Background Class
const BACKGROUND = new Background(backgroundInfo);

// Create instance of InputHandler Class
const input = new InputHandler();

// Select sounds from html document
const jumpStart = document.querySelector("#SNDjumpStart");
const jumpLand = document.querySelector("#SNDjumpLand");


let useUru = true;
let showVariables = true;

function animate() {

    // ------------------------------
    // WICH KEYS ARE BEING PRESSED ??
    // ------------------------------
    const KeyQty = input.keys.length;
    const Shift = input.keys.includes("Shift");
    const ArrowRight = input.keys.includes("ArrowRight");
    const ArrowLeft = input.keys.includes("ArrowLeft");
    const ArrowUp = input.keys.includes("ArrowUp");
    const ArorwDown = input.keys.includes("ArrowDown");


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
    BACKGROUND.updateLayers(URU.state.velocityX);

    // Player class draws itself 😀
    URU.draw(gameState.gameFrame);



    if (showVariables) {
        // Showing values below the character

        const animationLength = URU.metadata.animations[URU.state.action].length;
        const animationFrame = gameState.gameFrame % animationLength;
        const frameU = URU.metadata.animations[URU.state.action][animationFrame];

        document.querySelector("#showAction").innerText = URU.state.action;
        document.querySelector("#showDirection").innerText = URU.state.direction;
        document.querySelector("#showJumping").innerText = URU.state.jumping;
        // document.querySelector("#showRunning").innerText = URU.state.running;

        document.querySelector('#showVelocityX').innerText = URU.state.velocityX;
        document.querySelector('#showVelocityY').innerText = URU.state.velocityY;
        document.querySelector('#showPositionX').innerText = URU.state.x;
        document.querySelector('#showPositionY').innerText = URU.state.y;


        document.querySelector("#showAnimationLength").innerText = animationLength;
        document.querySelector("#showAnimationFrame").innerText = animationFrame;
        document.querySelector("#showFrameCoordinate").innerText = frameU;
        document.querySelector("#showBackX").innerText = BACKGROUND.layers[0].x;
        // document.querySelector("#showMiddleX").innerText = BACKGROUND.layers[1].x;
        // document.querySelector("#showNearX").innerText = BACKGROUND.layers[2].x;
        // document.querySelector('#showGroundX').innerText = BACKGROUND.layers[3].x;

        document.querySelector("#showLoopFrame").innerText = gameState.loopFrame;
        document.querySelector("#showGameFrame").innerText = gameState.gameFrame;
        document.querySelector("#showInput").innerText = input.keys;
    }

    (gameState.loopFrame % gameState.staggerFrames == 0) && gameState.gameFrame++;
    gameState.loopFrame++;
    requestAnimationFrame(animate);
}

animate();
