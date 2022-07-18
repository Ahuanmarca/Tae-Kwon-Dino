
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
        const { KeyQty, ArrowLeft, ArrowRight, ArrowUp, ArorwDown, Shift, v } = input.keysDict;

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


    
    
    updateCenterX() {
        this.mapPosition.cX = this.mapPosition.x + this.metadata.spriteWidth / 2;
    }

    getGroundLevel() {
    
        // TODO DON'T USE HARDCODED VALUESSSS !!
        const x = this.mapPosition.x;
        const w = this.metadata.spriteWidth;

        const hitX = x + 32;
        const hitW = w - 32;
        
        // TODO Use a currentLevel variable instead of hard coding LEVEL_01, so this is reusable
        this.state.leftTile = LEVEL_01.getTileInfo(hitX);
        this.state.rightTile = LEVEL_01.getTileInfo(hitW + x);
        this.state.centerTile = LEVEL_01.getTileInfo(this.mapPosition.cX);
        
        this.mapPosition.groundLevel = LEVEL_01.getGroundHeight(this.mapPosition.cX) ;
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
        if (ArrowUp && this.state.isGrounded) {
            this.state.velocityY = this.state.jumpForce;
            this.state.velocityX *= 2;
            this.state.jumping = true;
            this.metadata.sound && jumpStart.play();
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
        if (!this.state.isGrounded) {
            this.state.velocityY += gForce;
        } 
        // else {
            // this.mapPosition.y = this.mapPosition.groundLevel - this.metadata.spriteHeight;
            // TODO the magnet effect to fix the choppy animation on the down rump, but is causing a super jump
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

            if (this.state.jumping === true) {
                this.metadata.sound && jumpLand.play();
            }

            this.state.jumping = false;
            this.state.velocityY = 0; // ! Should Down Force be always present?
        }
    }

    updatePosition(INPUT) {
        const { KeyQty, ArrowLeft, ArrowRight, ArrowUp, ArorwDown, Shift, v } = INPUT.keysDict;

        this.updateCenterX();
        
        this.getGroundLevel();
        // this.updateIsGrounded();

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
