
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
            
            groundPosition: floorPosition - this.metadata.spriteHeight,
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

        this.position = {
            x: 10,
            y: 10,
        },

        this.tmp = {
            groundLevel: undefined,
            velocityY: 0,
        }
    }


    getGroundLevel() {
        
        const x = this.position.x;
        const w = this.metadata.spriteWidth;

        const leftTile = LEVEL_01.tileMap[x-x%64];
        const rightTile = LEVEL_01.tileMap[(x+w)-(x+w)%64];

        const groundLevel = Math.max(leftTile.y, rightTile.y);
        this.tmp.groundLevel = groundLevel;
    }

    applyGravity_NEW() {
        if (this.position.y < this.tmp.groundLevel - this.metadata.spriteHeight) {
            this.tmp.velocityY += forces.gravity;
            this.position.y += this.tmp.velocityY;
        } else {
            this.tmp.velocityY = 0;
        }

    }

    drawBox() {

        context.beginPath();
        context.strokeStyle = "pink";
        context.lineWidth = 10;
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(this.position.x + this.metadata.spriteWidth, this.position.y + this.metadata.spriteHeight);
        context.stroke();

    }

    // ! Ignoring Shift Running for the moment
    updateVelocityX(ArrowRight, ArrowLeft, Shift) {
        if (ArrowRight) {
            if (Shift) {
                this.state.velocityX += this.state.movementSpeed*3;
            } else {
                this.state.velocityX += this.state.movementSpeed;
            }
        }
        if (ArrowLeft) {
            if (Shift) {
                this.state.velocityX -= this.state.movementSpeed*3;
            } else {
                this.state.velocityX -= this.state.movementSpeed;
            }
        }
    }

    updateVelocityY(ArrowUp) {
        if (ArrowUp && !this.state.jumping) {
            this.state.velocityY = this.state.jumpForce;
            this.state.velocityX *= 2;
            this.state.jumping = true;
            jumpStart.play();
        }
    }

    // ! By turning this off, the sprite remains on the same
    // ! spot within the canvas, thus moving only relative to the background
    // !        The problem is that I NEED the sprite to move within
    // !        the canvas to get a "viewport" effect
    horizontalMovement() {
        this.state.x += this.state.velocityX;
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
        const frameV = 0; // TODO: Don't use hardcoded value!!

        context.drawImage(
            // Use the correct PNG file, depending on direction facing
            (this.state.direction == "right") ? this.metadata.faceRightSheet : this.metadata.faceLeftSheet,
            // Crop the PNG file
            frameU, frameV, this.metadata.spriteWidth, this.metadata.spriteHeight,
            // Sprite position on canvas
            this.state.x, this.state.y, this.metadata.spriteWidth, this.metadata.spriteHeight
        );
    }

} // ! Player Class definition ends here !!


