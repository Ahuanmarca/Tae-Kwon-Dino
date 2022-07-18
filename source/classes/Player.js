
class Player {
    constructor(position, spriteInfo) {
        
        this.metadata = {
            faceRightSheet: importImage(spriteInfo.metadata.fileRight),
            faceLeftSheet: importImage(spriteInfo.metadata.fileLeft),
            spriteWidth: spriteInfo.metadata.spriteWidth,
            spriteHeight: spriteInfo.metadata.spriteHeight,
            singleRow: spriteInfo.metadata.singleRow,
            animations: getAnimations(spriteInfo),
            sound: true,
            hitBoxOffset: 32,
        };

        this.state = {

            // State properties
            isIdle: undefined,
            isWalking: undefined,
            isRunning: undefined,
            isJumping: undefined,
            isFalling: undefined,
            isGrounded : undefined,
            isFacingRight: undefined,
            isFacingLeft: undefined,

            // Position (left and top)
            x: 10, // TODO Get from config file
            y:10, // TODO Get from config file
            // Velocity
            velocityX: 0,
            velocityY: 0,
            // Center X and Center Y
            cX: undefined,
            cY: undefined,
            // Previous y position
            //      So we know if it's falling!
            previousY : undefined,

            jumpForce: -30,
            movementSpeed: 0.3,
            runSpeedMultiplier: 2,


            jumping: false,
            falling: undefined,
            running: false,
            walking: false,

            // animation properties
            action: "idle",
            direction: "right",

            // usefull data for debugger
            leftTile: undefined,
            rightTile: undefined,
            centerTile: undefined,

        };

        this.position = {
            // Left and top
            x: 10,
            y: 10,
            // Center X and Center Y
            cX: undefined,
            cY: undefined,
            groundLevel: undefined,            
        }

        this.mapPosition = {
            // Center X and Center Y
            cX: undefined,
            cY: undefined,
            // Left and top
            x: 10,
            y: 10,
            groundLevel: undefined,
        };

    }


    /*
    ╭━━━╮╭╮╱╱╱╭╮╱╱╱╱╭╮╱╭╮╱╱╱╱╭╮╱╱╭╮
    ┃╭━╮┣╯╰╮╱╭╯╰╮╱╱╱┃┃╱┃┃╱╱╱╱┃┃╱╭╯╰╮
    ┃╰━━╋╮╭╋━┻╮╭╋━━╮┃┃╱┃┣━━┳━╯┣━┻╮╭╋━━╮
    ╰━━╮┃┃┃┃╭╮┃┃┃┃━┫┃┃╱┃┃╭╮┃╭╮┃╭╮┃┃┃┃━┫
    ┃╰━╯┃┃╰┫╭╮┃╰┫┃━┫┃╰━╯┃╰╯┃╰╯┃╭╮┃╰┫┃━┫
    ╰━━━╯╰━┻╯╰┻━┻━━╯╰━━━┫╭━┻━━┻╯╰┻━┻━━╯
    ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱┃┃
    ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╰╯
    -------------------------------------------
    Only updates state booleans
    Only cares about:
        - Input
        - Previous States
        - Position
    ------------------------------------------- */

    updateState(input) {
        const { KeyQty, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shift, v } = input.keysDict;

        // Idle State
        this.state.isIdle = (!ArrowLeft && !ArrowRight && !ArrowUp) && !this.state.isJumping;

        // Direction State
        if (ArrowLeft) {
            this.state.isFacingLeft = true;
            this.state.isFacingRight = false;
        }
        if (ArrowRight) {
            this.state.isFacingLeft = false;
            this.state.isFacingRight = true;    
        }

        // Running State
        if (Shift && (ArrowLeft || ArrowRight)) {
            this.state.isRunning = true;
        } else {
            this.state.isRunning = false;
        }
        
        // Walking State
        if ((ArrowLeft || ArrowRight) && !Shift && !this.state.isJumping) {
            this.state.isWalking = true;
        } else {
            this.state.isWalking = false;
        }

        // Jumping State
        this.state.isJumping = !this.state.isGrounded ? true : false;

        // Falling State
        if (this.mapPosition.y > this.state.previousY && !this.state.isGrounded) {
            this.state.isFalling = true;
        } else {
            this.state.isFalling = false;            
        }
        this.state.previousY = this.mapPosition.y;
        
        // ! I'm not convinced about this way of evaluating the isGrounded state!!
        // Grounded State 
        const difference = (this.mapPosition.groundLevel - this.metadata.spriteHeight) - this.mapPosition.y;
        this.state.isGrounded = difference <= 6.5;

    }


    /*  
    ╭━╮╭━╮╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╮
    ┃┃╰╯┃┃╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╯╰╮
    ┃╭╮╭╮┣━━┳╮╭┳━━┳╮╭┳━━┳━╋╮╭╯
    ┃┃┃┃┃┃╭╮┃╰╯┃┃━┫╰╯┃┃━┫╭╮┫┃
    ┃┃┃┃┃┃╰╯┣╮╭┫┃━┫┃┃┃┃━┫┃┃┃╰╮
    ╰╯╰╯╰┻━━╯╰╯╰━━┻┻┻┻━━┻╯╰┻━╯
    ------------------------------
    Cares about state and position
    Should not use kbrd input
    ------------------------------ */

    updatePosition(input, level) {
        const { KeyQty, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shift, v } = input.keysDict;

        this.updateCenterX();
        
        this.getGroundLevel(level);

        this.updateVelocityX(ArrowRight, ArrowLeft, Shift);
        this.updateVelocityY(ArrowUp);
        this.horizontalMovement(level);
        this.verticalMovement();
        this.applyGrativy(forces.gravity);
        this.horizontalFriction(forces.friction.horizontal);
        this.verticalFriction(forces.friction.vertical);
        this.applyFloorLimit();
    }

    updateCenterX() {
        this.mapPosition.cX = this.mapPosition.x + this.metadata.spriteWidth / 2;
    }

    getGroundLevel(level) {
    
        const x = this.mapPosition.x;
        const w = this.metadata.spriteWidth;

        const hitX = x + this.metadata.hitBoxOffset;
        const hitW = w - this.metadata.hitBoxOffset;
        
        this.state.leftTile = level.getTileInfo(hitX);
        this.state.rightTile = level.getTileInfo(hitW + x);
        this.state.centerTile = level.getTileInfo(this.mapPosition.cX);
        
        this.mapPosition.groundLevel = level.getGroundHeight(this.mapPosition.cX);
    }

    updateVelocityX(ArrowRight, ArrowLeft, Shift) {

        // Walking velocity
        if (!Shift) {
            ArrowRight && (this.state.velocityX += this.state.movementSpeed);
            ArrowLeft && (this.state.velocityX -= this.state.movementSpeed);
        }

        // Running velocity
        if (Shift) {
            ArrowRight && (this.state.velocityX += this.state.movementSpeed*this.state.runSpeedMultiplier);
            ArrowLeft && (this.state.velocityX -= this.state.movementSpeed*this.state.runSpeedMultiplier);
        }

    }


    updateVelocityY(ArrowUp) {
        if (ArrowUp && this.state.isGrounded) {
            this.state.velocityY = this.state.jumpForce;
            this.state.velocityX *= this.state.runSpeedMultiplier; // TODO Use another multiplier
            // this.state.isJumping = true;
            this.metadata.sound && jumpStart.play(); // TODO Create Sound Player Class
        }
    }


    horizontalMovement(level) {
        if (this.mapPosition.x < level.borderBarrier) {
            this.mapPosition.x = level.borderBarrier;
        } else if (this.mapPosition.x > (level.length - this.metadata.spriteWidth) - level.borderBarrier) {
            this.mapPosition.x = (level.length - this.metadata.spriteWidth) - level.borderBarrier;
        } else {
            this.mapPosition.x += this.state.velocityX;
        }
    }

    verticalMovement() {
        this.mapPosition.y += this.state.velocityY;
    }

    applyGrativy(gForce) {
        if (!this.state.isGrounded) {
            this.state.velocityY += gForce;
        } 
        // else {
            // this.mapPosition.y = this.mapPosition.groundLevel - this.metadata.spriteHeight;
            // TODO the magnet effect to fix the choppy animation on the down ramp, but is causing a super jump
        // }
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

            if (this.state.isJumping === true) {
                this.metadata.sound && jumpLand.play();
            }

            this.state.jumping = false;
            this.state.velocityY = 0; // ! Should Down Force be always present?
        }
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

        // Running Sprite
        if (Shift && ArrowLeft && !this.state.jumping) {
            this.set.action.run();
            this.set.direction.left();
        }
        if (Shift && ArrowRight && !this.state.jumping) {
            this.set.action.run();
            this.set.direction.right();
        }
        
        // Running state, not using for anything but display
        this.state.running = (this.state.action === "run") ? true : false;

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

        // Jumping Sprite
        if (!this.state.isGrounded) {
            this.set.action.jump();
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
