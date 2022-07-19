
// TODO Don't use hard coded values !!

class Viewport {
    constructor(player, level) {
        
        this.vpWidth = 640;
        this.vpHeight = 480;
        
        this.anchor = 0;
        this.tiles = {};
        
        this.faceRightOffset = 200;
        this.faceLeftOffset = 360;
        
        this.currentOffset = 200;
        this.offsetStep = 5;
        
        this.vpTail = 0;
        this.vpHead = level.length;
        
        this.leftmostAnchor = level.length - level.length;
        this.rightmostAnchor = level.length - this.vpWidth;
    }

    update(currentPlayer, currentLevel, gameState, context) {
        this.updateAnchor(currentPlayer, currentLevel);
        this.getTiles(currentLevel);
        this.drawBackground(currentPlayer, currentLevel, context);
        this.drawTiles(currentLevel);
        this.drawPlayer(currentLevel, currentPlayer, gameState.gameFrame)
    }

    updateAnchor(player, level) {

        // Updates anchor and offset depending on player position
        // ... and to which side is it facing
        
        if (player.mapPosition.x < this.faceRightOffset || 
            (player.mapPosition.x < this.faceLeftOffset && player.state.isFacingLeft)
            ) {
            this.anchor = this.leftmostAnchor;

        } else if (player.mapPosition.x > level.length - (this.vpWidth - this.faceRightOffset)) {
            this.anchor = this.rightmostAnchor;

        } else if (player.state.isFacingRight) {
            if (this.currentOffset > this.faceRightOffset) {
                this.currentOffset -= this.offsetStep;
            }
            this.anchor = Math.floor(player.mapPosition.x) - this.currentOffset;

        } else {
            if (this.currentOffset < this.faceLeftOffset) {
                this.currentOffset += this.offsetStep;
            }
            this.anchor = Math.floor(player.mapPosition.x) - this.currentOffset;
        }

    }


    /*    
    ╭━━━━┳╮
    ┃╭╮╭╮┃┃
    ╰╯┃┃┣┫┃╭━━┳━━╮
    ╱╱┃┃┣┫┃┃┃━┫━━┫
    ╱╱┃┃┃┃╰┫┃━╋━━┃
    ╱╱╰╯╰┻━┻━━┻━━╯
    -----------------------------
    Get the tiles, draw the tiles
    ----------------------------- */


    getTiles(level) {
        for (let key in level.tileMap) {
            if (level.tileMap[key].x >= this.anchor - level.tileWidth && level.tileMap[key].x <= this.anchor + this.vpWidth) {
                this.tiles[key] = level.tileMap[key];
            } else {
                delete this.tiles[key]
            }
        }
    }


    drawTiles(level) {
        for (let key in this.tiles) {
            
            const x = this.tiles[key].x - this.anchor; // x position on viewport needs offset by anchor
            const y = this.tiles[key].y;
            const tile = level.tiles[this.tiles[key].type]; // Gets tile from LEVEL object
            const u = tile.u;
            const v = tile.v;
            const tileWidth = tile.width;
            const tileHeight = tile.height;

            context.drawImage(
                // Image file
                tile.file,
                // File crop
                u, v, tileWidth, tileHeight,
                // Position on Canvas
                x, y, tileWidth, tileHeight
            )
        }
    }


    drawPlayer(level, player, gameFrame) {

        const animationLength = player.metadata.animations[player.state.actionSprite].length;
        const animationFrame = gameFrame % animationLength; // frame within sprite animation
        const u = player.metadata.animations[player.state.actionSprite][animationFrame];
        const v = 0; // TODO: Don't use hardcoded value!!

        // Get player Y position from it's map position
        const y = player.mapPosition.y + 16; // si it's not at the border of the tile

        let x = undefined;

        if (this.anchor === this.leftmostAnchor) {
            x = player.mapPosition.x;
        } else if (this.anchor === this.rightmostAnchor) {
            x = this.vpWidth - (level.length - player.mapPosition.x);
        } else {
            x = this.currentOffset;
        }

        context.drawImage(
            // Use the correct PNG file, depending on direction facing
            (player.state.isFacingRight) ? player.metadata.faceRightSheet : player.metadata.faceLeftSheet,
            // Crop the PNG file
            u, v, player.metadata.spriteWidth, player.metadata.spriteHeight,
            // Sprite position on canvas
            x, y, player.metadata.spriteWidth, player.metadata.spriteHeight
        );

    }


    drawBackground(player, level, context) {
        level.background.updateLayers(this.anchor, context);
    }


}

