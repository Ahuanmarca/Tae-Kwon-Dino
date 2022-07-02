const canvas = document.querySelector("#canvas1");
const context = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 640;
const CANVAS_HEIGHT = canvas.height = 480;

const groundThickness = 55;
const floorPosition = CANVAS_HEIGHT - groundThickness;
// const spriteGroundPosition = floorPosition - spriteHeight;
const maximumSpriteSpeed = 1;

let gameFrame = 0;
let loopFrame = 0;
let staggerFrames = 10;


// Create instance of Player Class for main character
const URU = new Player({x: CANVAS_WIDTH / 4, y: 353}, spriteInfo);


// Create instances of Layer Class for each background layer
background.files.forEach(file => {
    background.layers.push(new Layer(imageURL = file.url, distance = file.distance))
});

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
    // UPDATE CHARACTER'S POSITION ON THE WORLD!! -- USING CLASS !!
    // -------------------------------------------

    URU.updateVelocityX(ArrowRight, ArrowLeft, Shift);
    URU.updateVelocityY(ArrowUp);



    // Gravity
    URU.state.velocityY += 1;

    // Vertical Movement
    URU.state.y += URU.state.velocityY;

    // Horizontal Friction

    if (Math.abs(URU.state.velocityX) > 0.05) {
        URU.state.velocityX *= 0.9;
    } else {
        URU.state.velocityX = 0;
    }

    // Vertical Friction
    URU.state.velocityY *= 0.94;

    // Floor Limit
    if (URU.state.y > URU.state.groundPosition) {
        URU.state.y = URU.state.groundPosition;

        if (URU.state.jumping == true) {
            jumpLand.play();
        }

        URU.state.jumping = false;
        URU.state.velocityY = 0; // ! Not sure about this, should down force always be present?
    }

    let tmpPlayerSpeed = 0;

    if (ArrowRight && Shift) tmpPlayerSpeed = 4;
    if (ArrowLeft && Shift) tmpPlayerSpeed = -4;
    if (ArrowRight && !Shift) tmpPlayerSpeed = 2;
    if (ArrowLeft && !Shift) tmpPlayerSpeed = -2;
    
    URU.state.currentSpeed = tmpPlayerSpeed;
    background.baseSpeed = URU.state.currentSpeed;

    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    // Background layers update and draw themselves 😀
    BACKGROUND.updateLayers();

    // Player class draws itself 😀
    URU.draw(gameFrame);



    if (showVariables) {
        // Showing values below the character

        const animationLength = URU.metadata.animations[URU.state.action].length;
        const animationFrame = gameFrame % animationLength;
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
        document.querySelector("#showLoopFrame").innerText = loopFrame;
        document.querySelector("#showGameFrame").innerText = gameFrame;
        document.querySelector("#showBackX").innerText = background.layers[0].x;
        document.querySelector("#showMiddleX").innerText = background.layers[1].x;
        document.querySelector("#showNearX").innerText = background.layers[2].x;
        document.querySelector('#showGroundX').innerText = background.layers[3].x;
    }

    (loopFrame % staggerFrames == 0) && gameFrame++;
    loopFrame++;
    requestAnimationFrame(animate);
}

animate();
