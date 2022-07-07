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


    class Viewport {
        constructor(player, level) {
            this.anchor = player.mapPosition.x - CANVAS_WIDTH / 4;
        }
    }