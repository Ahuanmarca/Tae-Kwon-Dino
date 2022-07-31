
// TODO Don't use hard coded values !!

class Viewport {
    constructor(level, player) {
        
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

    update(currentLevel, currentPlayer, monsters, gameState, context) {
        this.updateAnchor(currentLevel, currentPlayer);
        this.getTiles(currentLevel);
        this.drawBackground(currentLevel, context);
        this.drawTiles(currentLevel, context);
        this.drawCharacter(currentLevel, currentPlayer, gameState.gameFrame, context)
        monsters.forEach(monster => {this.drawCharacter(currentLevel, monster, gameState.gameFrame, context)})
    }

    updateAnchor(level, player) {

        // Updates anchor and offset depending on player position
        // ... and to which side is it facing
        
        if (player.state.x < this.faceRightOffset || 
            (player.state.x < this.faceLeftOffset && player.state.isFacingLeft)
            ) {
            this.anchor = this.leftmostAnchor;

        } else if (player.state.x > level.length - (this.vpWidth - this.faceRightOffset)) {
            this.anchor = this.rightmostAnchor;

        } else if (player.state.isFacingRight) {
            if (this.currentOffset > this.faceRightOffset) {
                this.currentOffset -= this.offsetStep;
            }
            this.anchor = Math.floor(player.state.x) - this.currentOffset;

        } else {
            if (this.currentOffset < this.faceLeftOffset) {
                this.currentOffset += this.offsetStep;
            }
            this.anchor = Math.floor(player.state.x) - this.currentOffset;
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

    drawTiles(level, context) {

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

    drawCharacter(level, player, gameFrame, context) {

        let x = undefined;

        if (this.anchor === this.leftmostAnchor) {
            x = player.state.x;
        } else if (this.anchor === this.rightmostAnchor) {
            x = this.vpWidth - (level.length - player.state.x);
        } else {
            // x = this.currentOffset;
            x = player.state.x - this.anchor;
        }

        player.draw(level, gameFrame, context, x);

    }

    drawBackground(level, context) {
        level.background.updateLayers(this.anchor, context);
    }

}

