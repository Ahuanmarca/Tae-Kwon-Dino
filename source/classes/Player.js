
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
        };

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
        };

        this.mapPosition = {
            x: 10,
            y: 10,
            groundLevel: undefined,
        };


    }


    /*  
    ╭━╮╭━╮╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╮
    ┃┃╰╯┃┃╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╯╰╮
    ┃╭╮╭╮┣━━┳╮╭┳━━┳╮╭┳━━┳━╋╮╭╯
    ┃┃┃┃┃┃╭╮┃╰╯┃┃━┫╰╯┃┃━┫╭╮┫┃
    ┃┃┃┃┃┃╰╯┣╮╭┫┃━┫┃┃┃┃━┫┃┃┃╰╮
    ╰╯╰╯╰┻━━╯╰╯╰━━┻┻┻┻━━┻╯╰┻━╯
    --------------------------
    UDDATE THE SPRITE POSITION
    -------------------------- */


    getGroundLevel() {
        const x = this.mapPosition.x;
        const w = this.metadata.spriteWidth;

        const leftTile = LEVEL_01.tileMap[x-x%64];
        const rightTile = LEVEL_01.tileMap[(x+w)-(x+w)%64];

        const groundLevel = Math.max(leftTile.y, rightTile.y);
        this.mapPosition.groundLevel = groundLevel;
    }


    updateVelocityX(ArrowRight, ArrowLeft, Shift) {
        if (ArrowRight) {
            if (Shift) {
                this.state.velocityX += this.state.movementSpeed*2;
            } else {
                this.state.velocityX += this.state.movementSpeed;
            }
        }
        if (ArrowLeft) {
            if (Shift) {
                this.state.velocityX -= this.state.movementSpeed*2;
            } else {
                this.state.velocityX -= this.state.movementSpeed;
            }
        }
    }


    updateVelocityY(ArrowUp) {
        if (ArrowUp && this.mapPosition.y == this.mapPosition.groundLevel - this.metadata.spriteHeight) {
            this.state.velocityY = this.state.jumpForce;
            this.state.velocityX *= 2;
            this.state.jumping = true;  // ! Not working !!
            jumpStart.play();
        }
    }

    horizontalMovement() {
        if (this.mapPosition.x < 5) {
            this.mapPosition.x = 5;
        } else if (this.mapPosition.x > LEVEL_01.length - this.metadata.spriteWidth - 10) {
            this.mapPosition.x > LEVEL_01.length - this.metadata.spriteWidth - 10
        } else {
            this.mapPosition.x += this.state.velocityX;
        }

    }

    verticalMovement() {
        this.mapPosition.y += this.state.velocityY;
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
        if (this.mapPosition.y > this.mapPosition.groundLevel - this.metadata.spriteHeight) {
            
            this.mapPosition.y = this.mapPosition.groundLevel - this.metadata.spriteHeight;

            if (this.state.jumping === true) {
                jumpLand.play();
            }

            this.state.jumping = false;
            this.state.velocityY = 0; // ! Should Down Force be always present?
        }
    }

    updatePosition(INPUT) {
        const { KeyQty, ArrowLeft, ArrowRight, ArrowUp, ArorwDown, Shift, v } = INPUT.keysDict;
        this.getGroundLevel();
        this.updateVelocityX(ArrowRight, ArrowLeft, Shift);
        this.updateVelocityY(ArrowUp);
        this.horizontalMovement();
        this.verticalMovement();
        this.applyGrativy(forces.gravity);
        this.horizontalFriction(forces.friction.horizontal);
        this.verticalFriction(forces.friction.vertical);
        this.applyFloorLimit();

    }



    /*  
    ╭━━━╮╱╱╱╱╱╭╮╱╱╱╱╭━━━┳╮╱╱╱╱╱╱╱╭╮
    ┃╭━╮┃╱╱╱╱╭╯╰╮╱╱╱┃╭━╮┃┃╱╱╱╱╱╱╭╯╰╮
    ┃╰━━┳━━┳━╋╮╭╋━━╮┃╰━━┫╰━┳━━┳━┻╮╭╯
    ╰━━╮┃╭╮┃╭╋┫┃┃┃━┫╰━━╮┃╭╮┃┃━┫┃━┫┃
    ┃╰━╯┃╰╯┃┃┃┃╰┫┃━┫┃╰━╯┃┃┃┃┃━┫┃━┫╰╮
    ╰━━━┫╭━┻╯╰┻━┻━━╯╰━━━┻╯╰┻━━┻━━┻━╯
    ╱╱╱╱┃┃
    ╱╱╱╱╰╯
    ---------------------------
    UDDATE THE SPRITE ANIMATION
    --------------------------- */


    updateAnimation(input) {

        const { KeyQty, ArrowLeft, ArrowRight, ArrowUp, ArorwDown, Shift, v } = input.keysDict;

        // Idle Sprite
        if (!ArrowLeft && !ArrowRight && !ArrowUp) this.set.action.idle();

        // Jumping Sprite
        if (this.mapPosition.y < this.mapPosition.groundLevel - this.metadata.spriteHeight) {
            this.set.action.jump();
        }

        // Running Sprite
        if (Shift && ArrowLeft && !this.state.jumping) {
            this.set.action.run();
            this.set.direction.left();
        }
        if (Shift && ArrowRight && !this.state.jumping) {
            this.set.action.run();
            this.set.direction.right();
        }
        
        // Walking Sprite
        if (KeyQty === 1 && !this.state.jumping) {
            if (Shift) this.set.action.idle();
            if (ArrowRight) {
                this.set.action.walk();
                this.set.direction.right();
            }       
            if (ArrowLeft) {
                this.set.action.walk();
                this.set.direction.left();
            }
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

    
    /*
    ╭━━━╮╱╱╱╱╱╱╱╱╱╭╮
    ┃╭━╮┃╱╱╱╱╱╱╱╱╭╯╰╮
    ┃┃╱┃┣━╮╭┳╮╭┳━┻╮╭╋┳━━┳━╮
    ┃╰━╯┃╭╮╋┫╰╯┃╭╮┃┃┣┫╭╮┃╭╮╮
    ┃╭━╮┃┃┃┃┃┃┃┃╭╮┃╰┫┃╰╯┃┃┃┃
    ╰╯╱╰┻╯╰┻┻┻┻┻╯╰┻━┻┻━━┻╯╰╯
    -----------------------
    SPRITE CANVAS ANIMATION
    ----------------------- */


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
