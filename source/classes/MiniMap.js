miniMapConfig = {
    surfaceColor: "brown",
    surfaceWidth: 1,
    playerBoxLineWidth: 1,

}


class MiniMap {

    constructor(level, player, scale) {

        this.scale = scale;

        this.player = {
            width: player.metadata.spriteWidth*scale,
            height: player.metadata.spriteHeight*scale,
        }

        this.miniMap = {
            // account for the 0.25 scale on drawSurface() method
            levelLength: level.length,
            levelHeight: level.levelHeight,
            tileWidth: level.tileWidth,
            tileHeight: level.tileHeight,
            tyleTypes: level.tileTypes,
            tileMap: level.tileMap,
            tiles: level.tiles,
            levelName: level.name,
        }
    }

    drawSurface() {

        for (let key in this.miniMap.tileMap) {

            const scale = this.scale;
            const tile = this.miniMap.tileMap[key];
            const { height, width, platform, slope, wall } = this.miniMap.tiles[tile.type];

            const x = tile.x * scale;
            const y = tile.y * scale;
            const bottom = this.miniMap.levelHeight * scale;

            // Slope start and slope end
            //      If there's no slope, just starts and ends at 0
            const sB = slope[0] * scale; // Slope Begins
            const sE = slope[1] * scale; // Slope Ends

            // Platform start and end
            //      So each platforms draws from it's start to it's end, instead of using the tile width
            const pS = platform[1][0] * scale;
            const pE = platform[1][1] * scale;

            minCtx.beginPath();
            minCtx.strokeStyle = miniMapConfig.surfaceColor;
            minCtx.lineWidth = miniMapConfig.surfaceWidth;

            // Draw platforms
            minCtx.moveTo(x+pS, y+sB);
            minCtx.lineTo(x+pE, y+sE);

            // Draw walls
            wall && minCtx.moveTo((x+pE)-pS, y);
            wall && minCtx.lineTo((x+pE)-pS, bottom);
        
            // Perform the stroke, unless the tile is a "Hole"
            tile.type != "H" && minCtx.stroke();
        }
    }

    drawPlayer(player) {

        const x = player.mapPosition.x*this.scale;
        const y = player.mapPosition.y*this.scale;
        const w = player.metadata.spriteWidth*this.scale;
        const h = player.metadata.spriteHeight*this.scale;

        minCtx.beginPath();
        minCtx.strokeStyle = "#4d92bc";
        minCtx.lineWidth = miniMapConfig.playerBoxLineWidth;

        minCtx.moveTo(x,y);
        minCtx.lineTo(x+w,y);
        minCtx.lineTo(x+w,y+h);
        minCtx.lineTo(x,y+h);
        minCtx.lineTo(x,y)
        minCtx.stroke();
    }

}