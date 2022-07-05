const forces = {
    gravity: 1,
    friction: {
        horizontal: 0.9,
        vertical: 0.94,
    }
}

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const groundThickness = 55;
const floorPosition = CANVAS_HEIGHT - groundThickness;
