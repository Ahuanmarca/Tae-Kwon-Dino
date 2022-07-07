    /*
    ╭━╮╭━╮
    ┃┃╰╯┃┃
    ┃╭╮╭╮┣━━┳━━╮
    ┃┃┃┃┃┃╭╮┃╭╮┃
    ┃┃┃┃┃┃╭╮┃╰╯┃
    ╰╯╰╯╰┻╯╰┫╭━╯
    ╱╱╱╱╱╱╱╱┃┃
    ╱╱╱╱╱╱╱╱╰╯
    ------------------------------
    MOVE THE SPRITE WITHIN THE MAP
    ------------------------------ */

// TODO Don't use hard coded values !!

class Viewport {
    constructor() {
        this.anchor = 0;
        this.tiles = {};
    }


    updateAnchor(player, level) {
        if (player.mapPosition.x < 200) {
            this.anchor = 0;
        } else if (player.mapPosition.x > level.length - 440) {
            this.anchor = level.length - 640;
        } else if (player.state.direction === "right") {
            this.anchor = Math.floor(player.mapPosition.x) - 200;
        } else {
            this.anchor = Math.floor(player.mapPosition.x) - 360;
        }
    }


    getTiles(level) {
        for (let key in level.tileMap) {
            if (level.tileMap[key].x >= this.anchor - 64 && level.tileMap[key].x <= this.anchor + 640) {
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


    drawPlayer(player, gameFrame) {

        const animationLength = player.metadata.animations[player.state.action].length;
        const animationFrame = gameFrame % animationLength;
        const frameU = player.metadata.animations[player.state.action][animationFrame];
        const frameV = 0; // TODO: Don't use hardcoded value!!

        context.drawImage(
            // Use the correct PNG file, depending on direction facing
            (player.state.direction == "right") ? player.metadata.faceRightSheet : player.metadata.faceLeftSheet,
            // Crop the PNG file
            frameU, frameV, player.metadata.spriteWidth, player.metadata.spriteHeight,
            // Sprite position on canvas
            player.state.x, player.state.y, player.metadata.spriteWidth, player.metadata.spriteHeight
        );
    }
}

