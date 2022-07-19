miniMapConfig = {
    surfaceColor: "brown",
    surfaceWidth: 1,
    playerBoxLineWidth: 1,
}


class MiniMap {

    constructor(level, player, scale) {

        this.scale = scale;
        this.height = level.levelHeight * this.scale;
        this.width = level.length * this.scale;

        this.player = {
            width: player.metadata.spriteWidth*scale,
            height: player.metadata.spriteHeight*scale,
        }

        this.miniMap = {
            // account for the scale on drawSurface() method
            levelLength: level.length,
            levelHeight: level.levelHeight,
            tileWidth: level.tileWidth,
            tileHeight: level.tileHeight,
            tileTypes: level.tileTypes,
            tileMap: level.tileMap,
            tiles: level.tiles,
            levelName: level.name,
        }
    }

    update(currentLevel, currentPlayer, miniContext) {
        miniContext.clearRect(0, 0, this.width, this.height);
        this.drawSurface(currentLevel);
        this.drawPlayer(currentPlayer);
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
            //      So each platforms draws from it's start to it's end, instead of using tile width
            const pS = platform[1][0] * scale;
            const pE = platform[1][1] * scale;

            miniContext.beginPath();
            miniContext.strokeStyle = miniMapConfig.surfaceColor;
            miniContext.lineWidth = miniMapConfig.surfaceWidth;

            // Draw platforms
            miniContext.moveTo(x+pS, y+sB);
            miniContext.lineTo(x+pE, y+sE);

            // Draw walls
            wall && miniContext.moveTo((x+pE)-pS, y);
            wall && miniContext.lineTo((x+pE)-pS, bottom);
        
            // Perform the stroke, unless the tile is a "Hole"
            tile.type != this.miniMap.tileTypes.hole && miniContext.stroke();
        }
    }

    drawPlayer(player) {

        const x = player.mapPosition.x*this.scale;
        const y = player.mapPosition.y*this.scale;
        const w = player.metadata.spriteWidth*this.scale;
        const h = player.metadata.spriteHeight*this.scale;

        miniContext.beginPath();
        miniContext.strokeStyle = "#4d92bc";
        miniContext.lineWidth = miniMapConfig.playerBoxLineWidth;

        miniContext.moveTo(x,y);
        miniContext.lineTo(x+w,y);
        miniContext.lineTo(x+w,y+h);
        miniContext.lineTo(x,y+h);
        miniContext.lineTo(x,y)
        miniContext.stroke();
    }

}