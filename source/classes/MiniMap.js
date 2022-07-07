// TODO: DON'T USE HARD CODED VALUESSS
// 1/4 scale minimap below the main viewport

class MiniMap {

    constructor(levelInfo, player, scale) {
        this.player = {
            width: 96/4,
            height: 72/4,
            x: Math.floor(player.position.x*scale),
            y: Math.floor(player.position.y*scale),
        }
        this.miniMap = {
            width: levelInfo.length*scale,
            tileWidth: 64/4,
        }
    }

    drawSurface(levelInfo) {

        for (let key in levelInfo.tileMap) {
            minCtx.beginPath();
            minCtx.strokeStyle = "brown";
            minCtx.lineWidth = 1;
  
            if (levelInfo.tileMap[key].type === "D") {
                minCtx.moveTo(levelInfo.tileMap[key].x/4, levelInfo.tileMap[key].y/4);
                minCtx.lineTo(levelInfo.tileMap[key].x/4 + 16, levelInfo.tileMap[key].y/4 + 64/4 );
            } else if (levelInfo.tileMap[key].type === "U") {
                minCtx.moveTo(levelInfo.tileMap[key].x/4, levelInfo.tileMap[key].y/4+64/4);
                minCtx.lineTo(levelInfo.tileMap[key].x/4 + 16, levelInfo.tileMap[key].y/4);
            } else if (levelInfo.tileMap[key].type === "W") {
                minCtx.moveTo(levelInfo.tileMap[key].x/4 + (64/4)/2, 480/4)
                minCtx.lineTo(levelInfo.tileMap[key].x/4 + (64/4)/2, levelInfo.tileMap[key].y/4)
                minCtx.lineTo(levelInfo.tileMap[key].x/4 + 16, levelInfo.tileMap[key].y/4);
            } else if (levelInfo.tileMap[key].type === "E") {
                minCtx.moveTo(levelInfo.tileMap[key].x/4, levelInfo.tileMap[key].y/4);
                minCtx.lineTo(levelInfo.tileMap[key].x/4 + (64/4)/2, levelInfo.tileMap[key].y/4);
                minCtx.lineTo(levelInfo.tileMap[key].x/4 + (64/4)/2, 480/4);
            } else {
                minCtx.moveTo(levelInfo.tileMap[key].x/4, levelInfo.tileMap[key].y/4);
                minCtx.lineTo(levelInfo.tileMap[key].x/4 + 16, levelInfo.tileMap[key].y/4);
            }
            minCtx.stroke();
        }
    }

    drawPlayer() {
        minCtx.beginPath();
        minCtx.strokeStyle = "#4d92bc";
        minCtx.lineWidth = 1;

        minCtx.moveTo(this.player.x, this.player.y);
        minCtx.lineTo(this.player.x+this.player.width, this.player.y);
        minCtx.lineTo(this.player.x+this.player.width, this.player.y+this.player.height);
        minCtx.lineTo(this.player.x, this.player.y+this.player.height);
        minCtx.lineTo(this.player.x, this.player.y)
        minCtx.stroke();
    }

}