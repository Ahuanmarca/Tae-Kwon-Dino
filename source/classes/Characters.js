import { importImage } from '../helpers/importImage.js'
import { getAnimations } from '../helpers/getAnimations.js'

export class Character {
    constructor(position, spriteInfo) {
        
        this.metadata = {
            name: spriteInfo.metadata.name,
            faceRightSheet: importImage(spriteInfo.metadata.fileRight),
            faceLeftSheet: importImage(spriteInfo.metadata.fileLeft),
            spriteWidth: spriteInfo.metadata.spriteWidth,
            spriteHeight: spriteInfo.metadata.spriteHeight,
            singleRow: spriteInfo.metadata.singleRow,
            animations: getAnimations(spriteInfo),
            sound: true,

            // Behaviors, just used for monsters. // TODO: Refactor to monsters subclass
            primaryAction: spriteInfo.metadata.primaryAction,
            secondaryAction: spriteInfo.metadata.secondaryAction,
            fallsLedge: spriteInfo.metadata.fallsLedge,
            jumpsBarrier: spriteInfo.metadata.jumpsBarrier,
            // currentAction: this.metadata.primaryAction,

            boundingBoxOffset: 20, // ? Should this offset come from the info file?
            startingHealth: spriteInfo.metadata.hp,

            actionSprites: {
                idle: "idle",
                walk: "walk",
                run: "run",
                jump: "jump",
                hurt: "hurt",
                bite: "bite",
            },

            directionSprites: {
                right: "right",
                left: "left",
            },

            // ! Trying to pass all this to an AudioPlayer Class !!
            // soundFX: {
            //     jumpStart: importAudio("assets/sounds/Jump-2.wav"),
            //     jumpLand: importAudio("assets/sounds/jumpland.wav"),
            //     bite: importAudio("assets/sounds/random2.wav"),
            //     attack: importAudio("assets/sounds/tube-plastic-whoosh-01.wav"),
            // },
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
            isTakingDamage: false,

            currentHealth: this.metadata.startingHealth,

            velocityX: 0,
            velocityY: 0,
            // Left and top
            x: position.x,
            y: position.y,
            // Center X and Center Y
            cX: undefined,
            cY: undefined,
            groundLevel: undefined,
            previousY: undefined,

            // Modifiers
            jumpForce: -30,
            movementSpeed: spriteInfo.metadata.movementSpeed,
            runSpeedMultiplier: 2,

            // animation properties
            directionSprite: this.metadata.directionSprites.right,
            actionSprite: this.metadata.actionSprites.idle,

            // usefull data for debugger
            leftTile: undefined,
            rightTile: undefined,
            centerTile: undefined,

        };
    }

    update(input, currentLevel) {
        this.updateState(input, currentLevel);
        this.updatePosition(input, currentLevel);
        if (this.state.y > currentLevel.levelHeight*2) {
            // this.metadata.soundFX.attack.play(); // TODO Refactor to AudioPlayer
            this.fallDamage();
        }
        this.updateAnimation();
    }

    fallDamage() {
        this.state.currentHealth = 0;
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

    updateState(input, currentLevel) {
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

        // Falling State
        if (this.state.y > this.state.previousY && !this.state.isGrounded) {
            this.state.isFalling = true;
            this.state.isJumping = false;
        } else {
            this.state.isFalling = false;            
        }
        this.state.previousY = this.state.y;

        // Jumping State
        // this.state.isJumping = !this.state.isGrounded && !this.state.isFalling;
        // this.state.isJumping = ArrowUp && this.state.isGrounded;
        if (ArrowUp && this.state.isGrounded) {
            this.state.isJumping = true;
        }


        
        // ! I'm not convinced about this way of evaluating the isGrounded state
        // Grounded State 
        const difference = (this.state.groundLevel - this.metadata.spriteHeight) - this.state.y;
        this.state.isGrounded = difference <= 6.5;
        // this.state.isGrounded = (this.state.groundLevel - this.metadata.spriteHeight) === this.state.y;

        // Update neighbors
        this.state.centerTile = currentLevel.getTileInfo(this.state.cX);
        this.state.leftTile = currentLevel.getTileInfo(this.boundingBox()[0][0]);
        this.state.rightTile = currentLevel.getTileInfo(this.boundingBox()[1][0]);

        // Update center x
        this.state.cX = this.state.x + this.metadata.spriteWidth / 2;

        // Update ground level
        this.state.groundLevel = currentLevel.getGroundHeight(this.state.cX);
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


    updatePosition(input, currentLevel) {
        this.updateVelocityX(input, currentLevel);
        this.updateVelocityY(input);
        this.horizontalMovement(currentLevel);
        this.verticalMovement();
        this.applyGrativy(currentLevel);
        this.horizontalFriction(currentLevel);
        this.verticalFriction(currentLevel);
        this.applyFloorLimit();
    }


    updateVelocityX(input, currentLevel) {
        const { KeyQty, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shift, v } = input.keysDict;

        if (this.touchingBarrier(currentLevel)) {
            this.state.velocityX = 0;
        } else {
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
    }


    updateVelocityY(input) {
        const { KeyQty, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shift, v } = input.keysDict;

        if (ArrowUp && this.state.isGrounded) {
            this.state.velocityY = this.state.jumpForce;
            this.state.velocityX *= this.state.runSpeedMultiplier; // ! Beware, reusing multiplier for different purpose
            // this.metadata.sound && this.metadata.soundFX.jumpStart.play(); // TODO Refactor to AudioPlayer
        }
    }

    horizontalMovement(level) {
        if (this.state.x < level.borderBarrier) {
            this.state.x = level.borderBarrier;
        } else if (this.state.x > (level.length - this.metadata.spriteWidth) - level.borderBarrier) {
            this.state.x = (level.length - this.metadata.spriteWidth) - level.borderBarrier;
        } else {
            this.state.x += this.state.velocityX;
        }
    }

    verticalMovement() {
        this.state.y += this.state.velocityY;
    }

    applyGrativy(level) {
        if (!this.state.isGrounded) {
            this.state.velocityY += level.gravity;
        } 
        // else {
            // this.state.y = this.state.groundLevel - this.metadata.spriteHeight;
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
        if (this.state.y > this.state.groundLevel - this.metadata.spriteHeight) {
            
            this.state.y = this.state.groundLevel - this.metadata.spriteHeight;

            if (this.state.isJumping === true) {
                // this.metadata.sound && this.metadata.soundFX.jumpLand.play(); // TODO Refactor to AudioPlayer
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

        // Taking Damage
        this.state.isTakingDamage && this.setActionSprite(this.metadata.actionSprites.hurt);
    }

    setDirectionSprite(directionSprite) {
        this.state.directionSprite = directionSprite;
    }

    setActionSprite(actionSprite) {
        this.state.actionSprite = actionSprite;
    }


    
    /*    
    ╭━━━╮╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭━━━╮
    ┃╭━╮┃╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╰╮╭╮┃
    ┃┃╱╰╋━━┳━╮╭╮╭┳━━┳━━╮╱┃┃┃┣━┳━━┳╮╭╮╭╮
    ┃┃╱╭┫╭╮┃╭╮┫╰╯┃╭╮┃━━┫╱┃┃┃┃╭┫╭╮┃╰╯╰╯┃
    ┃╰━╯┃╭╮┃┃┃┣╮╭┫╭╮┣━━┃╭╯╰╯┃┃┃╭╮┣╮╭╮╭╯
    ╰━━━┻╯╰┻╯╰╯╰╯╰╯╰┻━━╯╰━━━┻╯╰╯╰╯╰╯╰╯
    -----------------------
    SPRITE CANVAS DRAWING
    ----------------------- */

    draw(level, gameFrame, context, x) {

        const animationLength = this.metadata.animations[this.state.actionSprite].length;
        const animationFrame = gameFrame % animationLength;
        const frameU = this.metadata.animations[this.state.actionSprite][animationFrame];
        const frameV = 0; // TODO: Don't use hardcoded value!!

        const y = this.state.y + 16; // so it's not at the border of the tile

        context.drawImage(
            // Use the correct PNG file, depending on direction facing
            (this.state.isFacingRight) ? this.metadata.faceRightSheet : this.metadata.faceLeftSheet,
            // Crop the PNG file
            frameU, frameV, this.metadata.spriteWidth, this.metadata.spriteHeight,
            // Sprite position on canvas
            x, y, this.metadata.spriteWidth, this.metadata.spriteHeight
        );
    }


    /*
    ╭╮╱╭╮╭╮╱╭╮╱╭╮
    ┃┃╱┃┣╯╰╮┃┃╭╯╰╮
    ┃┃╱┃┣╮╭╋┫┃┣╮╭╋┳━━┳━━╮
    ┃┃╱┃┃┃┃┣┫┃┣┫┃┣┫┃━┫━━┫
    ┃╰━╯┃┃╰┫┃╰┫┃╰┫┃┃━╋━━┃
    ╰━━━╯╰━┻┻━┻┻━┻┻━━┻━━╯
    𝓤 𝓽 𝓲 𝓵 𝓲 𝓽 𝓲 𝓮 𝓼
    -------------------------------------------
    Convenience functions
    ------------------------------------------- */

    boundingBox() { // Corners are top left and bottom right
        const tlX = this.state.x + this.metadata.boundingBoxOffset; // offset to inside of sprite for contact
        const tlY = this.state.y;
        const brX = this.state.x + this.metadata.spriteWidth - this.metadata.boundingBoxOffset;
        const brY = this.state.y + this.metadata.spriteHeight;
        return [[tlX, tlY], [brX, brY]];
    }

    testCollition(gameObject) {
        const [tl, br] = this.boundingBox();
        const [_tl, _br] = gameObject.boundingBox();

        // collition happens if any of the two corners of gameObject is within our two corners
        if (tl[0] <= _tl[0] && _tl[0] <= br[0] && tl[1] <= _tl[1] && _tl[1] <= br[1] ) {
            return true;
        } else if (tl[0] <= _br[0] && _br[0] <= br[0] && tl[1] <= _br[1] && _br[1] <= br[1] )  {
            return true;
        } else if (_tl[0] <= tl[0] && tl[0] <= _br[0] && _tl[1] <= tl[1] && tl[1] <= _br[1] ) {
            return true;
        } else if (_tl[0] <= br[0] && br[0] <= _br[0] && _tl[1] <= br[1] && br[1] <= _br[1] )  {
            return true;
        } else {
            return false;
        }
    }

    // ! I think this is too complicated for just finding a barrier
    // TODO Can I use the boundingBox() function instead of all this?

    touchingBarrier(currentLevel) {

        const tolerance = 30;
        const previousGroundLevel = currentLevel.getGroundHeight(this.boundingBox()[0][0]);
        const nextGroundLevel = currentLevel.getGroundHeight(this.boundingBox()[1][0]);

        const nextGroundLevelIsHigher = nextGroundLevel + tolerance < (this.state.y + this.metadata.spriteHeight);
        const previousGroundLevelIsHigher = previousGroundLevel + tolerance < this.state.y + this.metadata.spriteHeight

        const rightTileIsWall = currentLevel.tiles[this.state.rightTile.type].wall;
        const leftTileIsWall = currentLevel.tiles[this.state.leftTile.type].wall;

        if (nextGroundLevelIsHigher && rightTileIsWall && this.state.isFacingRight) {
            return true;
        } else if (previousGroundLevelIsHigher && leftTileIsWall && this.state.isFacingLeft) {
            return true;
        } else {
            return false;
        }
    }

    onCliffBorder(currentLevel) {
        const previousGroundLevel = currentLevel.getGroundHeight(this.boundingBox()[0][0]);
        const nextGroundLevel = currentLevel.getGroundHeight(this.boundingBox()[1][0]);

        return [previousGroundLevel > currentLevel.levelHeight, nextGroundLevel > currentLevel.levelHeight]
    }
} // ! Character Class definition ends here !!


export class Player extends Character {

}


export class Monster extends Character {

    // TODO Create different AIs for every mosnter
    // Some code is unactive but will be used later
    // I want different AIs for every mosnter
    // Some mosnters need the level and character information
    // i.e. the monster that follows the player needs player and level info

    generateInput(currentLevel, currentPlayer) {
        if (this.metadata.primaryAction === "patrol") {
            return this.patrolPlatform();
        }
        
        if (this.metadata.primaryAction === "follow") {
            
            if (Math.abs(this.state.x - currentPlayer.state.x) < 300) {
                return this.followPlayer(currentLevel, currentPlayer);
            } else {
                return this.patrolPlatform();
            }
        }
    }

    patrolPlatform() {

        // TODO: FIX THIS !!
        // ! Problem will show on other behaviors 
        // Currently checking this.state.righTile for undefined because
        // it begins as undefined and only updates on the next loop...
        // State should always be defined by the time I need it!!

        if (this.state.rightTile) {
            
            if (this.state.rightTile.type != "_") {
                this.state.isFacingRight = false;
                this.state.isFacingLeft = true;
            }
            
            if (this.state.leftTile.type != "_") {
                this.state.isFacingRight = true;
                this.state.isFacingLeft = false;
            }
            
            if (this.state.isFacingRight) {
                return fakeKeypress(["ArrowRight"]);
            } else {
                return fakeKeypress(["ArrowLeft"]);
            }
        } else {
            return fakeKeypress(["ArrowLeft"]);
        }
    }

    followPlayer(currentLevel, currentPlayer) {

        if (this.state.rightTile) {

            if (currentPlayer.state.x + currentPlayer.metadata.spriteWidth - 36 < this.state.x && !this.onCliffBorder(currentLevel)[0]) {

                if (this.touchingBarrier(currentLevel)) {
                    return fakeKeypress(["ArrowLeft", "Shift", "ArrowUp"]);
                } else {
                    return fakeKeypress(["ArrowLeft", "Shift"]);
                }


            } else if (currentPlayer.state.x > this.state.x + this.metadata.spriteWidth - 36 && !this.onCliffBorder(currentLevel)[1]) {


                if (this.touchingBarrier(currentLevel)) {
                    return fakeKeypress(["ArrowRight", "Shift", "ArrowUp"]);
                } else {
                    return fakeKeypress(["ArrowRight", "Shift"]);
                }


            } else {
                return fakeKeypress([]);
            }

        } else {
            return fakeKeypress([]);
        }


    }

}
