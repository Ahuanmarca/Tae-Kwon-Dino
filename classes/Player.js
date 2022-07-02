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
            // Position of the sprite within the canvas
            x: position.x,
            y: position.y,
            velocityX: 0,
            velocityY: 0,
            movementSpeed: 0.3,
            jumpForce: -30,
        }

    }

    // ! Ignoring Shift Running for the moment
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

    // ! By turning this off, the sprite remains on the same
    // ! spot within the canvas, thus moving only relative to the background
    // !        The problem is that I NEED the sprite to move within
    // !        the canvas to get a "viewport" effect
    horizontalMovement() {
        // this.state.x += this.state.velocityX;
    }

    verticalMovement() {
        this.state.y += this.state.velocityY;
    }

    applyGrativy(gForce) {
        this.state.velocityY += gForce;
    }

    horizontalFriction(hfForce) {
        if (Math.abs(this.state.velocityX) > 0.05) {
            this.state.velocityX *= hfForce;
        } else {
            this.state.velocityX = 0;
        }
    }

    verticalFriction(vfForce) {
        this.state.velocityY *= vfForce;
    }

    applyFloorLimit() {
        if (this.state.y > this.state.groundPosition) {
            this.state.y = this.state.groundPosition;

            if (this.state.jumping === true) {
                jumpLand.play();
            }

            this.state.jumping = false;
            this.state.velocityY = 0; // ! Should Down Force be always present?
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
