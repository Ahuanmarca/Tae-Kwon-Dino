class Player {
    constructor(position, spriteInfo) {
        
        // ! I'm not sure if I should destructure this variables first, for readability purposes
        this.metadata = {
            faceRightSheet: importImage(spriteInfo.metadata.fileRight),
            faceLeftSheet: importImage(spriteInfo.metadata.fileLeft),
            spriteWidth: spriteInfo.metadata.spriteWidth,
            spriteHeight: spriteInfo.metadata.spriteHeight,
            singleRow: spriteInfo.metadata.singleRow,
            animations: getAnimations(spriteInfo),
        }

        this.state = {
            // absolutePosition:100, // For connecting the sprite with the "map"
            currentSpeed: 0,
            action: "idle",
            direction: "right",
            groundPosition: floorPosition - this.metadata.spriteHeight, // ! DON'T LIKE
            isGrounded : true, // ! NOT USING
            jumping: false,
            running: false,
            x: position.x || 0,
            y: position.y || 0,
            velocityX: 0,
            velocityY: 0,
            movementSpeed: 0.3,
            jumpForce: -30,
        }

    }

    updateVelocityX(ArrowRight, ArrowLeft, Shift) {
        if (ArrowRight) {
            this.state.velocityX += this.state.movementSpeed;
        }
        if (ArrowLeft) {
            this.state.velocityX -= this.state.movementSpeed;
        }
    }

    updateVelocityY(ArrowUp) {
        if (ArrowUp && !this.state.jumping) {
            this.state.velocityY = this.state.jumpForce;
            this.state.jumping = true;
            jumpStart.play();
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
    draw(gameFrame) {

        const animationLength = this.metadata.animations[this.state.action].length;
        const animationFrame = gameFrame % animationLength;
        const frameU = this.metadata.animations[this.state.action][animationFrame];
        const frameV = 0; // ! Need to solve this, really bad that it's hardcoded

        context.drawImage(
            // Use the correct PNG file, depending on direction facing
            (this.state.direction == "right") ? this.metadata.faceRightSheet : this.metadata.faceLeftSheet,
            // Crop the PNG file
            frameU, frameV, this.metadata.spriteWidth, this.metadata.spriteHeight,
            // Sprite position on canvas
            this.state.x, this.state.y, this.metadata.spriteWidth, this.metadata.spriteHeight
        );
    }
}
