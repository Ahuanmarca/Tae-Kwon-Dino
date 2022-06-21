const canvas = document.querySelector("#canvas1");
const context = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 640;
const CANVAS_HEIGHT = canvas.height = 480;

// pseudo player data
const playerState = {
    currentSpeed: 0,
}

// Some globally needed variables
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
    ],
    layers: [],
}

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
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', e => {
            if (    (e.key === 'ArrowRight' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'Shift')
                    && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', e => {
            if (    e.key === 'ArrowRight' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'Shift') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}

background.files.forEach(file => {
    background.layers.push(new Layer(imageURL = file.url, distance = file.distance))
});

const input = new InputHandler();

function animate() {

    let tmpPlayerSpeed = 0;

    if (input.keys.includes("ArrowRight") && input.keys.includes("Shift")) tmpPlayerSpeed = 4;
    if (input.keys.includes("ArrowLeft") && input.keys.includes("Shift")) tmpPlayerSpeed = -4;
    if (input.keys.includes("ArrowRight") && !input.keys.includes("Shift")) tmpPlayerSpeed = 1;
    if (input.keys.includes("ArrowLeft") && !input.keys.includes("Shift")) tmpPlayerSpeed = -1;
    

    playerState.currentSpeed = tmpPlayerSpeed;
    background.baseSpeed = playerState.currentSpeed;

    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    
    background.layers.forEach(layer => {
        layer.updateSpeed();
        layer.updatePostion();
        layer.draw();
    });


    // Console log x values for all layers
    document.querySelector("#showBackX").innerText = background.layers[0].x;
    document.querySelector("#showBackXPlus").innerText = background.layers[0].x + background.width;
    document.querySelector("#showBackDifference").innerText = ((background.layers[0].x + background.width) - background.layers[0].x);
    document.querySelector("#showMiddleX").innerText = background.layers[1].x;
    document.querySelector("#showMiddleXPlus").innerText = background.layers[1].x + background.width;
    document.querySelector("#showMiddleDifference").innerText = ((background.layers[1].x + background.width) - background.layers[1].x);
    document.querySelector("#showNearX").innerText = background.layers[2].x;
    document.querySelector("#showNearXPlus").innerText = background.layers[2].x + background.width;
    document.querySelector("#showNearDifference").innerText = ((background.layers[2].x + background.width) - background.layers[2].x);

    input.keys.length > 0 && console.log(input.keys);

    requestAnimationFrame(animate);
}

animate();



// HELPERS

function importImage(imageURL) {
    const importedImage = new Image();
    importedImage.src = imageURL;
    return importedImage;
}