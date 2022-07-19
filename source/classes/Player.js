
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
            actionSprites: {
                idle: "idle",
                walk: "walk",
                run: "run",
                jump: "jump",
            },
            directionSprites: {
                right: "right",
                left: "left",
            },
        };

        this.state = {

            // State properties
            isIdle: undefined,
            isWalking: undefined,
            isRunning: undefined,
            isJumping: undefined,
            isFalling: undefined,
            isGrounded : undefined,
            isFacingRight: true,
            isFacingLeft: false,

            velocityX: 0,
            velocityY: 0,

            // Modifiers
            jumpForce: -30,
            movementSpeed: 0.3,
            runSpeedMultiplier: 2,

            // animation properties
            directionSprite: this.metadata.directionSprites.right,
            actionSprite: this.metadata.actionSprites.idle,

            // usefull data for debugger
            leftTile: undefined,
            rightTile: undefined,
            centerTile: undefined,

        };

        this.mapPosition = {
            // Left and top
            x: 10,
            y: 10,
            // Center X and Center Y
            cX: undefined,
            cY: undefined,
            groundLevel: undefined,
            previousY: undefined,
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
        if (this.mapPosition.y > this.mapPosition.previousY && !this.state.isGrounded) {
            this.state.isFalling = true;
        } else {
            this.state.isFalling = false;            
        }
        this.mapPosition.previousY = this.mapPosition.y;
        
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

        // this.updateVelocityX(ArrowRight, ArrowLeft, Shift);
        this.updateVelocityX(input);
        this.updateVelocityY(input);
        this.horizontalMovement(level);
        this.verticalMovement();
        this.applyGrativy(level);
        this.horizontalFriction(level);
        this.verticalFriction(level);
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

    updateVelocityX(input) {
        const { KeyQty, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shift, v } = input.keysDict;

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

    updateVelocityY(input) {
        const { KeyQty, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shift, v } = input.keysDict;

        if (ArrowUp && this.state.isGrounded) {
            this.state.velocityY = this.state.jumpForce;
            this.state.velocityX *= this.state.runSpeedMultiplier; // ! Beware, reusing multiplier for different purpose
            this.metadata.sound && jumpStart.play();
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

    applyGrativy(level) {
        if (!this.state.isGrounded) {
            this.state.velocityY += level.gravity;
        } 
        // else {
            // this.mapPosition.y = this.mapPosition.groundLevel - this.metadata.spriteHeight;
            // TODO the magnet effect to fix the choppy animation on the down ramp, but is causing a super jump
        // }
    }

    horizontalFriction(level) {
        if (Math.abs(this.state.velocityX) > 0.05) { // So it won't keep multiplying forever
            this.state.velocityX *= level.horizontalFriction;
        } else {
            this.state.velocityX = 0;
        }
    }

    verticalFriction(level) {
        this.state.velocityY *= level.verticalFriction;
    }

    applyFloorLimit() {
        if (this.mapPosition.y > this.mapPosition.groundLevel - this.metadata.spriteHeight) {
            
            this.mapPosition.y = this.mapPosition.groundLevel - this.metadata.spriteHeight;

            if (this.state.isJumping === true) {
                this.metadata.sound && jumpLand.play();
            }

            this.state.velocityY = 0;
        }
    }


    /*
    ╭━━━╮╱╱╱╱╱╭╮╱╱╱╱╭━━━╮╱╱╱╱╱╱╱╱╱╭╮
    ┃╭━╮┃╱╱╱╱╭╯╰╮╱╱╱┃╭━╮┃╱╱╱╱╱╱╱╱╭╯╰╮
    ┃╰━━┳━━┳━╋╮╭╋━━╮┃┃╱┃┣━╮╭┳╮╭┳━┻╮╭╋┳━━┳━╮
    ╰━━╮┃╭╮┃╭╋┫┃┃┃━┫┃╰━╯┃╭╮╋┫╰╯┃╭╮┃┃┣┫╭╮┃╭╮╮
    ┃╰━╯┃╰╯┃┃┃┃╰┫┃━┫┃╭━╮┃┃┃┃┃┃┃┃╭╮┃╰┫┃╰╯┃┃┃┃
    ╰━━━┫╭━┻╯╰┻━┻━━╯╰╯╱╰┻╯╰┻┻┻┻┻╯╰┻━┻┻━━┻╯╰╯
    ╱╱╱╱┃┃
    ╱╱╱╱╰╯
    -------------------------------
    Update Sprite Animation
    Use State Info, don't use Input
    ------------------------------- */


    updateAnimation() {

        // Direction of sprite
        this.state.isFacingRight && this.setDirectionSprite(this.metadata.directionSprites.right);
        this.state.isFacingLeft && this.setDirectionSprite(this.metadata.directionSprites.left);
 
        // Idle Sprite
        this.state.isIdle && this.setActionSprite(this.metadata.actionSprites.idle);

        // Running Sprite
        this.state.isRunning && this.setActionSprite(this.metadata.actionSprites.run);

        // Walking Sprite
        this.state.isWalking && this.setActionSprite(this.metadata.actionSprites.walk);

        // Jumping Sprite
        !this.state.isGrounded && this.setActionSprite(this.metadata.actionSprites.jump);

    }

    setDirectionSprite(directionSprite) {
        this.state.directionSprite = directionSprite;
    }

    setActionSprite(actionSprite) {
        this.state.actionSprite = actionSprite;
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
    // TODO I'm not sure if this method should be here or in Viewport🤔

    // draw(gameFrame) {

    //     const animationLength = this.metadata.animations[this.state.actionSprite].length;
    //     const animationFrame = gameFrame % animationLength;
    //     const frameU = this.metadata.animations[this.state.actionSprite][animationFrame];
    //     const frameV = 0; // TODO: Don't use hardcoded value!!

    //     context.drawImage(
    //         // Use the correct PNG file, depending on direction facing
    //         (this.state.isFacingRight) ? this.metadata.faceRightSheet : this.metadata.faceLeftSheet,
    //         // Crop the PNG file
    //         frameU, frameV, this.metadata.spriteWidth, this.metadata.spriteHeight,
    //         // Sprite position on canvas
    //         this.state.x, this.state.y, this.metadata.spriteWidth, this.metadata.spriteHeight
    //     );
    // }

} // ! Player Class definition ends here !!
