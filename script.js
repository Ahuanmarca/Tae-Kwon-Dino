const canvas = document.querySelector("#canvas1");
const context = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 640;
const CANVAS_HEIGHT = canvas.height = 480;

const spriteWidth = 96;
const spriteHeight = 72;
const groundThickness = 55;
const floorPosition = CANVAS_HEIGHT - groundThickness;
const spriteGroundPosition = floorPosition - spriteHeight;
const faceRightSheet = importImage("assets/dino-right.png");
const faceLeftSheet = importImage("assets/dino-left.png");
const maximumSpriteSpeed = 1;


let gameFrame = 0;
let loopFrame = 0;
let staggerFrames = 10;


// Background stuff
const background = {
    baseSpeed: 0,
    width: 1024,
    height: 480,
    files: [
        {
            url: "assets/back.png",
            distance: 10,
        },
        {
            url: "assets/middle.png",
            distance: 3.5,
        },
        {
            url: "assets/near.png",
            distance: 1.5,
        },
        {
            url: "assets/ground.png",
            distance: 1,
        },
    ],
    layers: [],
}

// const foo = import("./assets/dino-right.png")


class Player {
    constructor(x, y) {
        this.state = {
            absolutePosition:100,
            currentSpeed: 0,
            action: "idle",
            direction: "right",
            groundPosition: floorPosition - spriteHeight, // ! DON'T LIKE
            isGrounded : true, // ! NOT USING
            jumping: false,
            running: false,
            x: x,
            y: y,
            velocityX: 0,
            velocityY: 0,
            movementSpeed: 0.3,
            jumpForce: -30,
            // spriteData: 
        }
    }


    set = {
        action: {
            idle: () => this.state.action = "idle",
            walk: () => this.state.action = "walk",
            run: () => this.state.action = "run",
            jump: () => this.state.action = "jump",
        },
        direction: {
            right: () => this.state.direction = "right",
            left: () => this.state.direction = "left",
        },
    }

    // Sprite canvas animation
    draw(frameX) {
        context.drawImage(
            (this.state.direction == "right") ? faceRightSheet : faceLeftSheet,
            frameX, 0, spriteWidth, spriteHeight,
            this.state.x, this.state.y, spriteWidth, spriteHeight
        );
    }
}

const shyGuy = new Player(
    x = CANVAS_WIDTH / 2 - spriteHeight / 2, 
    y = floorPosition - spriteHeight
);



// Layer class needs:
//      image URL
//      distance
// Cares about:
//      player position

class Layer {
    constructor(imageURL, distance) {
        this.imageURL = imageURL;
        this.distance = distance;

        // Layer position
        this.y = 0;
        this.x = 0;

        // Width and height (should come from some json file)
        this.width = background.width;
        this.height = background.height;

        // Import image from file
        this.image = importImage(imageURL);

        // More distance = Less speed
        this.speed = background.baseSpeed / distance;

    }

    // CHANGE SPEED DINAMICALLY BASED ON OTHER FACTORS, LIKE CHARACTER POSITION....
    updateSpeed() {
        this.speed = background.baseSpeed / this.distance;
    }

    // Update X position of current layer
    updatePostion() {
        if (this.x < -this.width) {
            this.x = 0;
        } else if (this.x > 0) {
            this.x = -this.width;
        } else {
            this.x = this.x - this.speed;
        }
    }

    draw() {
        context.drawImage(this.image, Math.floor(this.x), this.y, this.width, this.height);
        context.drawImage(this.image, Math.floor(this.x + this.width), this.y, this.width, this.height);
    }
}

background.files.forEach(file => {
    background.layers.push(new Layer(imageURL = file.url, distance = file.distance))
});

const playerState = {

    // The background needs this
    currentSpeed: 0,

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
                    e.key === 'ArrowUp' && this.keys.indexOf('ArrowUp') != -1 ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Shift') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        })
    }
}

const input = new InputHandler();
const jumpLand = document.querySelector("#SNDjumpLand");
const URU = new Player(CANVAS_WIDTH / 4, 353);

let useDino = false;
let useUru = true;

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


    if (useUru) {

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
            const jumpStart = document.querySelector("#SNDjumpStart");
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


    }




    let tmpPlayerSpeed = 0;

    if (input.keys.includes("ArrowRight") && input.keys.includes("Shift")) tmpPlayerSpeed = 4;
    if (input.keys.includes("ArrowLeft") && input.keys.includes("Shift")) tmpPlayerSpeed = -4;
    if (input.keys.includes("ArrowRight") && !input.keys.includes("Shift")) tmpPlayerSpeed = 2;
    if (input.keys.includes("ArrowLeft") && !input.keys.includes("Shift")) tmpPlayerSpeed = -2;
    
    playerState.currentSpeed = tmpPlayerSpeed;
    background.baseSpeed = playerState.currentSpeed;




    if (useDino) {

        // ------------------------------
        // UDDATE THE SPRITE ANIMATION !! -- NOT USING CLASS
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


        // Jump
        if (ArrowUp && !playerState.jumping) {
            playerState.velocityY = playerState.jump_force;
            playerState.jumping = true;
        }

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

            if (playerState.jumping == true) {
                jumpLand.play();
            }

            playerState.jumping = false;
        }
    }

    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    const animationLength = animations[playerState.action].length;
    let animationFrame = gameFrame % animationLength;

    // Frame coordinate inside the PNG file
    // let frameX = animations[playerState.action][animationFrame];
    let frameX = animations[URU.state.action][animationFrame];

    background.layers.forEach(layer => {
        layer.updateSpeed();
        layer.updatePostion();
        layer.draw();
    });

    // Sprite canvas animation
//     context.drawImage(
        // PNG file
//         (playerState.direction == "right") ? faceRightSheet : faceLeftSheet,
        // Crop inside of the PNG file
//         frameX, 0, spriteWidth, spriteHeight,
        // Position of the sprite within the canvas
//         playerState.x, playerState.y, spriteWidth, spriteHeight
//     );

    URU.draw(frameX);


    // Draw floor
    // context.beginPath();
    // context.moveTo(0, floorPosition);
    // context.lineTo(CANVAS_WIDTH, floorPosition);
    // context.stroke();

    

    // Showing values below the character
    document.querySelector("#showAction").innerText = URU.state.action;
    document.querySelector("#showDirection").innerText = URU.state.direction;
    document.querySelector("#showJumping").innerText = URU.state.jumping;
    // document.querySelector("#showRunning").innerText = URU.state.running;
    document.querySelector("#showAnimationLength").innerText = animationLength;
    document.querySelector("#showAnimationFrame").innerText = animationFrame;
    document.querySelector("#showFrameCoordinate").innerText = frameX;
    // document.querySelector("#showLoopFrame").innerText = loopFrame;
    // document.querySelector("#showGameFrame").innerText = gameFrame;

    document.querySelector("#showBackX").innerText = background.layers[0].x;
    document.querySelector("#showMiddleX").innerText = background.layers[1].x;
    document.querySelector("#showNearX").innerText = background.layers[2].x;
    document.querySelector('#showGroundX').innerText = background.layers[3].x;

    (loopFrame % staggerFrames == 0) && gameFrame++;
    loopFrame++;
    requestAnimationFrame(animate);
}

animate();




// const jumpStart = document.querySelector("#jumpStart");
// window.addEventListener('keydown', (e) => {
//     if (e.key === 'ArrowUp') {
//         jumpStart.play();
//     }
// });



// const byteSound = document.querySelector("#byteSound");
// window.addEventListener('keydown', (e) => {
//     if (e.key === ' ') {
//         byteSound.play();
//     }
// });

// window.addEventListener('keydown', (e) => {
//     console.log(e.key);
// });






























// HELPERS
function importImage(imageURL) {
    const importedImage = new Image();
    importedImage.src = imageURL;
    return importedImage;
}
