// TODO: DON'T USE HARD CODED VALUESSS
// 1*this.scale scale minimap below the main viewport

class MiniMap {

    constructor(level, player, scale) {

        this.scale = scale;


        this.player = {
            width: player.metadata.spriteWidth*scale,
            height: player.metadata.spriteHeight*scale,
            // x: Math.floor(player.position.x*scale),
            // y: Math.floor(player.position.y*scale),
        }
        this.miniMap = {
            width: level.length*scale,
            tileWidth: level.tileWidth * scale,
        }
    }

    drawSurface(level) {



        for (let key in level.tileMap) {

            const tile = level.tileMap[key]

            const x = level.tileMap[key].x*this.scale;
            const y = level.tileMap[key].y*this.scale;
            const w = level.tileWidth*this.scale;
            const h = level.tileHeight*this.scale;
             // TODO don't use hard coded value
            const slope = h*0.25; // ? because the slope is 1/4th of the tile's height
            const bottom = level.levelHeight * this.scale;

            minCtx.beginPath();
            minCtx.strokeStyle = "brown"; // TODO don't use hard coded value
            minCtx.lineWidth = 1; // TODO don't use hard coded value
  
            if (tile.type === "D") {
                // downhill slope
                minCtx.moveTo(x, y);
                minCtx.lineTo(x+w, y+slope );
            } else if (tile.type === "U") {
                // uphill slope
                minCtx.moveTo(x, y+slope);
                minCtx.lineTo(x+w, y);
            } else if (tile.type === "W") {
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
                // platform
                minCtx.moveTo(x, y);
                minCtx.lineTo(x+w, y);
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