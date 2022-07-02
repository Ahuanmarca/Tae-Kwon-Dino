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