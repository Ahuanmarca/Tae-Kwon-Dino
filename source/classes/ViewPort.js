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
            this.anchor = player.mapPosition.x - 200;
        } else {
            this.anchor = player.mapPosition.x - 360;
        }
    }

    getTiles(level) {
        for (let key in level.tileMap) {
            if (level.tileMap[key].x >= this.anchor && level.tileMap[key].x <= this.anchor + 640) {
                this.tiles[key] = level.tileMap[key];
            } else {
                delete this.tiles[key]
            }
        }
    }
}

