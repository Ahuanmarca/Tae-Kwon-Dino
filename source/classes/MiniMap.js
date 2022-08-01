const miniMapConfig = {
    surfaceColor: "brown",
    surfaceWidth: 1,
    playerBoxLineWidth: 1,
}


export class MiniMap {

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
        this.drawSurfaceLine(currentLevel, miniContext);
        this.drawPlayerBox(currentPlayer, miniContext);
    }

    drawSurfaceLine(currentLevel, miniContext) {

        for (let key in currentLevel.tileMap) {

            const scale = this.scale;
            const tile = currentLevel.tileMap[key];
            const { height, width, platform, slope, wall } = currentLevel.tiles[tile.type];

            const x = tile.x * scale;
            const y = tile.y * scale;
            const bottom = this.height;

            // Slope start and end
            //      Represents Y position, modifies the platform
            //      If there's no slope, just starts and ends at 0
            const slopeStart = slope[0] * scale; // Slope Start
            const slopeEnd = slope[1] * scale; // Slope End

            // Platform start and end
            //      each platforms draws from it's start to it's end
            const platformStart = platform[1][0] * scale;
            const platformEnd = platform[1][1] * scale;

            miniContext.beginPath();
            miniContext.strokeStyle = miniMapConfig.surfaceColor;
            miniContext.lineWidth = miniMapConfig.surfaceWidth;

            // Draw platforms
            miniContext.moveTo(x+platformStart, y+slopeStart);
            miniContext.lineTo(x+platformEnd, y+slopeEnd);

            // Draw walls
            wall && miniContext.moveTo((x+platformEnd)-platformStart, y);
            wall && miniContext.lineTo((x+platformEnd)-platformStart, bottom);
        
            // Perform the stroke, unless the tile is a "Hole"
            tile.type != currentLevel.tileTypes.hole && miniContext.stroke();
        }
    }

    drawPlayerBox(player, miniContext) {

        const x = player.state.x*this.scale;
        const y = player.state.y*this.scale;
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
