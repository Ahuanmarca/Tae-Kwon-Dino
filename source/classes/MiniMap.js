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

    update(currentLevel, currentPlayer, currentMonsters, miniContext) {
        miniContext.clearRect(0, 0, this.width, this.height);
        this.drawSurfaceLine(currentLevel, miniContext);
        this.drawPlayerBox(currentPlayer, miniContext, "#4d92bc");

        currentMonsters.forEach(monster => {
            this.drawPlayerBox(monster, miniContext, "#00FF00");
        })
    }

    drawSurfaceLine(currentLevel, miniContext) {

        // TODO Stack Overflow article article makes me think this (maybe) should be an array instead of a dictionary
        // That way it would be much easier to get the next item on the array
        // I want to know the next tile to be drawn because sometimes I need it's y position
        // https://stackoverflow.com/questions/12505598/get-next-key-value-pair-in-an-object

        for (let key in currentLevel.tileMap) {
            
            const scale = this.scale;
            const tile = currentLevel.tileMap[key];
            const { height, width, platform, slope, wall } = currentLevel.tiles[tile.type];
            
            // Need previous and next tile to correct vertical line from ledges
            //      Adding / substracting 64 because I know the keys are integers with 64 increments
            //      TODO Refactor hard coded values
            const nextTile = currentLevel.tileMap[(parseInt(key) + 64).toString()]; // BEWARE Will get undefined at level's end
            const prevTile = currentLevel.tileMap[(parseInt(key) - 64).toString()]; // BEWARE Will get undefined at level's start

            const colorCodes = {
                "_": "darkcyan",
                ")": "magenta", 
                "(": "magenta",
                "[": "darkmagenta",
                "]": "darkmagenta",
                ">": "coral",
                "<": "coral",
                ".": "white",
                "^": "purple",
            }

            let colorCode = colorCodes[tile.type];

            const x = tile.x * scale;
            const y = tile.y * scale;
            const bottom = this.height; // DOUBT height of minimap already defined on the class... not sure about this

            // BEWARE Meaning of SLOPE and PLATFORM is confusing !!
            // TODO Make code more readable so this long commentary isn't necessary
            
            //      slope[0] defines slope's y (height) in relation of tile's y, at the start of the tile (leftmost of tile)
            //      slope[1] defines slope's y at the end of the tile (rightmost of the tile)
            //      If there's no slope, just starts and ends at 0
            
            //      platform[1][0] defines platform starting x, in relation to the platform's x position
            //      platform[1][1] defines platform ending x
            //      tile could go from 0 to 64, 
            //      platformStart to platformEnd could be
            //      from 0 to 32, from 32 to 64 or from 0 to 64

            const slopeStart = slope[0] * scale; // Slope Start Height
            const slopeEnd = slope[1] * scale; // Slope End Height

            const platformStart = platform[1][0] * scale; // platform is two values that modify y position for drawing
            const platformEnd = platform[1][1] * scale;

            miniContext.beginPath();
            miniContext.strokeStyle = colorCode;
            miniContext.lineWidth = miniMapConfig.surfaceWidth;

            // Draw platforms and slopes
            miniContext.moveTo(x+platformStart, y+slopeStart);
            miniContext.lineTo(x+platformEnd, y+slopeEnd);

            // Draw walls
            if (tile.type == "[" || tile.type == "]") {
                miniContext.moveTo((x+platformEnd)-platformStart, y);
                miniContext.lineTo((x+platformEnd)-platformStart, bottom);
            }
        
            // Draw Ledges
            if (tile.type == ")") {
                miniContext.moveTo( (x+platformEnd), y);
                miniContext.lineTo( (x+platformEnd), nextTile.y*scale);
            }

            if (tile.type == "(") {
                miniContext.moveTo(x, y);
                miniContext.lineTo(x, prevTile.y*scale);
            }

            miniContext.stroke();
        }
    }

    drawPlayerBox(player, miniContext, color) {

        const x = player.state.x*this.scale;
        const y = player.state.y*this.scale;
        const w = player.metadata.spriteWidth*this.scale;
        const h = player.metadata.spriteHeight*this.scale;

        const characterColorCode = {
            "Uru": "#4d92bc",
            "greenDino": "forestgreen",
            "redDino": "crimson",
        }

        miniContext.beginPath();
        miniContext.strokeStyle = characterColorCode[player.metadata.name];
        miniContext.lineWidth = miniMapConfig.playerBoxLineWidth;

        miniContext.moveTo(x,y);
        miniContext.lineTo(x+w,y);
        miniContext.lineTo(x+w,y+h);
        miniContext.lineTo(x,y+h);
        miniContext.lineTo(x,y)
        miniContext.stroke();
    }

}
