// TODO I think the constructor needs to create more properties when the class is instanced
miniMapConfig = {
    surfaceColor: "brown",
    surfaceWidth: 1,

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

            // TODO I have access to individual tile's information, figure out a way
            // TODO to use that information to simplify the conditionals

            const scale = this.scale;
            const tile = this.miniMap.tileMap[key];
            const { height, width, platform, slope, wall } = this.miniMap.tiles[tile.type];

            const x = tile.x * scale;
            const y = tile.y * scale;
            const w = width * scale;
            const h = height * scale;
            
            const sB = slope[0] * scale; // Slope Begins
            const sE = slope[1] * scale; // Slope Ends

            const bottom = this.miniMap.levelHeight * scale;

            minCtx.beginPath();
            minCtx.strokeStyle = miniMapConfig.surfaceColor;
            minCtx.lineWidth = miniMapConfig.surfaceWidth;
  


            if (tile.type === "W") {
                // west wall
                minCtx.moveTo(x+w/2, bottom) // TODO don't use hard coded value
                minCtx.lineTo(x+w/2, y) // TODO don't use hard coded value
                minCtx.lineTo(x+w, y);
            } else if (tile.type === "E") {
                // east wall
                minCtx.moveTo(x, y);
                minCtx.lineTo(x+w/2, y); // TODO don't use hard coded value
                minCtx.lineTo(x+w/2, bottom); // TODO don't use hard coded value
            } else {
                // platform, uphill, downhill
                minCtx.moveTo(x, y+sB);
                minCtx.lineTo(x+w, y+sE);
            }
            minCtx.stroke();
        }
    }



    drawPlayer(player) {

        const x = player.mapPosition.x*this.scale;
        const y = player.mapPosition.y*this.scale;
        const w = player.metadata.spriteWidth*this.scale;
        const h = player.metadata.spriteHeight*this.scale;

        minCtx.beginPath();
        minCtx.strokeStyle = "#4d92bc";
        minCtx.lineWidth = 1;

        minCtx.moveTo(x,y);
        minCtx.lineTo(x+w,y);
        minCtx.lineTo(x+w,y+h);
        minCtx.lineTo(x,y+h);
        minCtx.lineTo(x,y)
        minCtx.stroke();
    }

}