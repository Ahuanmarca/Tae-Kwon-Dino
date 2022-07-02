const canvas = document.querySelector("#canvas1");
const context = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 640;
const CANVAS_HEIGHT = canvas.height = 480;

// const spriteWidth = 96;
const spriteHeight = 72;
const groundThickness = 55;
const floorPosition = CANVAS_HEIGHT - groundThickness;
const spriteGroundPosition = floorPosition - spriteHeight;
const maximumSpriteSpeed = 1;

let gameFrame = 0;
let loopFrame = 0;
let staggerFrames = 10;

// Create instance of Player Object for main character
const URU = new Player({x: CANVAS_WIDTH / 4, y: 353}, spriteInfo);

// Create instances of Layer Object for each background layer
background.files.forEach(file => {
    background.layers.push(new Layer(imageURL = file.url, distance = file.distance))
});

// Create instance of Input Handler class
const input = new InputHandler();

// Select sounds from html document
const jumpStart = document.querySelector("#SNDjumpStart");
const jumpLand = document.querySelector("#SNDjumpLand");


let useUru = true;
let showVariables = false;

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

    // Running ?
    if (Shift && ArrowLeft) {
        URU.set.action.run();
        URU.set.direction.left();
    }
    if (Shift && ArrowRight) {
        URU.set.action.run();
        URU.set.direction.right();
    }
    
    // Walking ?
    if (KeyQty === 1) {
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
    // UPDATE CHARACTER'S POSITION IN THE SCREEN!! -- USING CLASS !!
    // -------------------------------------------

    // Move Left Or Right
    if (ArrowRight) {
        URU.state.velocityX += URU.state.movementSpeed;
    }
    if (ArrowLeft) {
        URU.state.velocityX -= URU.state.movementSpeed;
    }

    // Jump
    if (ArrowUp && !URU.state.jumping) {
        URU.state.velocityY = URU.state.jumpForce;
        URU.state.jumping = true;
        jumpStart.play();
    }

    // Gravity
    URU.state.velocityY += 1;

    // Vertical Movement
    URU.state.y += URU.state.velocityY;

    // Friction
    URU.state.velocityX *= 0.9;
    URU.state.velocityY *= 0.9;

    // Floor Limit
    if (URU.state.y > floorPosition - spriteHeight) {
        URU.state.y = floorPosition - spriteHeight;

        if (URU.state.jumping == true) {
            jumpLand.play();
        }

        URU.state.jumping = false;
    }



    let tmpPlayerSpeed = 0;

    if (input.keys.includes("ArrowRight") && input.keys.includes("Shift")) tmpPlayerSpeed = 4;
    if (input.keys.includes("ArrowLeft") && input.keys.includes("Shift")) tmpPlayerSpeed = -4;
    if (input.keys.includes("ArrowRight") && !input.keys.includes("Shift")) tmpPlayerSpeed = 2;
    if (input.keys.includes("ArrowLeft") && !input.keys.includes("Shift")) tmpPlayerSpeed = -2;
    
    URU.state.currentSpeed = tmpPlayerSpeed;
    background.baseSpeed = URU.state.currentSpeed;

    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    // Background class draws itself 😀
    background.layers.forEach(layer => {
        layer.updateSpeed();
        layer.updatePostion();
        layer.draw();
    });

    // Player class draws itself 😀
    URU.draw(gameFrame);



    // if (showVariables) {
        // Showing values below the character

        const animationLength = URU.metadata.animations[URU.state.action].length;
        const animationFrame = gameFrame % animationLength;
        const frameU = URU.metadata.animations[URU.state.action][animationFrame];

        document.querySelector("#showAction").innerText = URU.state.action;
        document.querySelector("#showDirection").innerText = URU.state.direction;
        document.querySelector("#showJumping").innerText = URU.state.jumping;
        // document.querySelector("#showRunning").innerText = URU.state.running;
        document.querySelector("#showAnimationLength").innerText = animationLength;
        document.querySelector("#showAnimationFrame").innerText = gameFrame % URU.metadata.animations[URU.state.action].length;
        document.querySelector("#showFrameCoordinate").innerText = frameU;
        document.querySelector("#showLoopFrame").innerText = loopFrame;
        document.querySelector("#showGameFrame").innerText = gameFrame;
        document.querySelector("#showBackX").innerText = background.layers[0].x;
        document.querySelector("#showMiddleX").innerText = background.layers[1].x;
        document.querySelector("#showNearX").innerText = background.layers[2].x;
        document.querySelector('#showGroundX').innerText = background.layers[3].x;
    // }

    (loopFrame % staggerFrames == 0) && gameFrame++;
    loopFrame++;
    requestAnimationFrame(animate);
}

animate();
