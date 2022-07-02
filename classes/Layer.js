class Layer {
    constructor(imageURL, distance, width, height, baseSpeed) {

        this.imageURL = imageURL;
        this.distance = distance;

        // Layer position (starts at x = 0, y = 0)
        this.y = 0;
        this.x = 0;

        // Width and height
        this.width = width;
        this.height = height;

        // Import image from file
        this.image = importImage(imageURL);

        // More distance = Less speed
        this.speed = baseSpeed / distance;

    }

    // CHANGE SPEED DINAMICALLY BASED ON OTHER FACTORS, LIKE CHARACTER POSITION....
    updateSpeed(baseSpeed) {
        this.speed = baseSpeed / this.distance;
    }

    // Update X position of current layer
    updatePosition() {
        if (this.x < -this.width) {
            this.x = 0;
        } else if (this.x > 0) {
            this.x = -this.width;
        } else {
            this.x = this.x - this.speed;
        }
    }

    // Draws the image two times so they can stitch together when scrolling
    draw() {
        context.drawImage(
            // Image file
            this.image, 
            // Position on Canvas
            Math.floor(this.x), this.y, this.width, this.height
        );
        context.drawImage(
            // Image file
            this.image, 
            // Position on Canvas
            Math.floor(this.x + this.width), this.y, this.width, this.height
        );
    }
}

class Background {
    constructor(backgroundInfo) {

        this.baseSpeed = backgroundInfo.metadata.baseSpeed;
        this.width = backgroundInfo.metadata.width;
        this.height = backgroundInfo.metadata.height;

        this.layers = createLayers(backgroundInfo);
        
    }

    updateLayers() {
        this.layers.forEach(layer => {
            layer.updateSpeed(this.baseSpeed);
            layer.updatePosition();
            layer.draw();
        });
    }
}

function createLayers(backgroundInfo) {
    const layers = [];
    const { width, height, baseSpeed } = backgroundInfo.metadata;

    backgroundInfo.files.forEach(file => {
        const layer = new Layer(file.url, file.distance, width, height, baseSpeed);
        layers.push(layer);
    });
    
    return layers;
}
