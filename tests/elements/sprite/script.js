const canvas = document.querySelector("#canvas1");
const context = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 640;
const CANVAS_HEIGHT = canvas.height = 480;

const spriteWidth = 96;
const spriteHeight = 72;
const groundThickness = 50;
const floorPosition = CANVAS_HEIGHT - groundThickness;
const faceRightSheet = importImage("assets/dino-right.png");
const faceLeftSheet = importImage("assets/dino-left.png");
const maximumSpriteSpeed = 1;

let gameFrame = 0;
let loopFrame = 0;
let staggerFrames = 10;

const playerState = {
    action: "idle",
    direction: "right",
    groundedPosition: floorPosition - spriteHeight,

    jumping: false,
    running: false,

    x: CANVAS_WIDTH / 2 - spriteWidth / 2,
    y: floorPosition - spriteHeight,
    velocityX: 0,
    velocityY: 0,
    movementSpeed: 0.3,
    jump_force: -30,
}

const animations = [];
const animationsStates = [
    {
        name: "idle",
        frames: 4,            
    },
    {
        name: "walk",
        frames: 6,            
    },
    {
        name: "kick",
        frames: 4,            
    },
    {
        name: "hurt",
        frames: 3,            
    },
    {
        name: "jump",
        frames: 1,            
    },
    {
        name: "run",
        frames: 6,            
    },
]


// Populate sprite.animations with coordinates of png file sprites
let j = 0;
animationsStates.forEach(state => {
    let frames = [];
    for (let i = 0; i < state.frames; i++) {
        frames.push(j * spriteWidth);
        j++;
    }
    animations[state.name] = frames;
});


class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', e => {
            if (    e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Shift') {
                this.keys.indexOf(e.key) === -1 && this.keys.push(e.key);
            }
        })
        window.addEventListener('keyup', e => {
            if (    e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Shift') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        })
    }
}

const input = new InputHandler();

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
    // UDDATE THE SPRITE ANIMATION !!
    // ------------------------------
    if (KeyQty === 0) playerState.action = "idle";
    playerState.running = Shift ? true : false;

    if (KeyQty === 1) {
        if (Shift) playerState.action = "idle";
        if (ArrowRight) {
            playerState.action = "walk";
            playerState.direction = "right";
        }       
        if (ArrowLeft) {
            playerState.action = "walk";
            playerState.direction = "left";
        }
    }

    if (KeyQty == 2) {
        if (playerState.running) {
            if (ArrowRight) {
                playerState.action = "run";
                playerState.direction = "right";
            }
            if (ArrowLeft) {
                playerState.action = "run";
                playerState.direction = "left";
            }
        } else {
            if (ArrowRight) {
                playerState.action = "walk";
                playerState.direction = "right";
            }
            if (ArrowLeft) {
                playerState.action = "walk";
                playerState.direction = "left";
            }
        }     
    }


    // -------------------------------------------
    // UPDATE CHARACTER'S POSITION IN THE SCREEN!!
    // -------------------------------------------


    // Move to the sides
    if (ArrowRight) {
        playerState.velocityX += playerState.movementSpeed;
    }
    if (ArrowLeft) {
        playerState.velocityX -= playerState.movementSpeed;
    }

    // Horizontal movement
    playerState.x += playerState.velocityX;

    // Gravity
    playerState.velocityY += 1;

    // Vertical movement
    playerState.y += playerState.velocityY;

    // Friction
    playerState.velocityX *= 0.9;
    playerState.velocityY *= 0.9;

    // Floor limit
    if (playerState.y > floorPosition - spriteHeight) {
        playerState.y = floorPosition - spriteHeight;
        playerState.jumping = false;
    }

    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    const animationLength = animations[playerState.action].length;
    let animationFrame = gameFrame % animationLength;

    // Frame coordinate inside the PNG file
    let frameX = animations[playerState.action][animationFrame];

    // Sprite canvas animation
    context.drawImage(
        (playerState.direction == "right") ? faceRightSheet : faceLeftSheet,
        frameX, 0, spriteWidth, spriteHeight,
        playerState.x, playerState.y, spriteWidth, spriteHeight
    );

    // Draw floor
    context.beginPath();
    context.moveTo(0, floorPosition);
    context.lineTo(CANVAS_WIDTH, floorPosition);
    context.stroke();

    document.querySelector("#showAction").innerText = playerState.action;
    document.querySelector("#showDirection").innerText = playerState.direction;
    document.querySelector("#showJumping").innerText = playerState.jumping;
    document.querySelector("#showRunning").innerText = playerState.running;
    document.querySelector("#showAnimationLength").innerText = animationLength;
    document.querySelector("#showAnimationFrame").innerText = animationFrame;
    document.querySelector("#showFrameCoordinate").innerText = frameX;
    document.querySelector("#showLoopFrame").innerText = loopFrame;
    document.querySelector("#showGameFrame").innerText = gameFrame;

    (loopFrame % staggerFrames == 0) && gameFrame++;
    loopFrame++;
    requestAnimationFrame(animate);
}

animate();



/* <p>action: <span id="showAction"></span></p>
<p>direction: <span id="showDirection"></span></p>
<p>jumping: <span id="showJumping"></span></p>
<p>running: <span id="showRunning"></span></p> */
































// HELPERS
function importImage(imageURL) {
    const importedImage = new Image();
    importedImage.src = imageURL;
    return importedImage;
}