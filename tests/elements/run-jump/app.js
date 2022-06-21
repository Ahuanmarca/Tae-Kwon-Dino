const canvas = document.querySelector("#canvas1")
ctx = canvas.getContext("2d");
CANVAS_HEIGTH = canvas.height = 480;
CANVAS_WIDTH = canvas.width = 720;

// Little pink square
const body = {

    height: 32,
    width: 32,
    x: CANVAS_WIDTH / 2, //center of the canvas
    y: CANVAS_HEIGTH / 4,
    x_velocity: 0,
    y_velocity: 0,
    jumping: true,
    speed: 0.3,
    jump_force: 15,
}

const controller = {

    left: false,
    right: false,
    up: false,

    keyListener: function(event) {

        let isPressed = (event.type === "keydown") ? true : false;

        switch(event.key) {
            case "ArrowLeft":
                controller.left = isPressed;
                break;
            case "ArrowUp":
                controller.up = isPressed;
                break;
            case "ArrowRight":
                controller.right = isPressed;
                break;
        }
    }
}

loop = function() {

    // Jump! Only happens if the body is on the ground
    if (controller.up && body.jumping == false  ) {
        body.y_velocity -= body.jump_force;
        body.x_velocity += body.x_velocity * 1.5;
        body.jumping = true;
    }

    // Move Left (with acceleration!!)
    //      Speed increases while pressing the key !!!
    if (controller.left) {
        body.x_velocity -= body.speed;
    }

    // Move Right (with acceleration too)
    //      Speed increases while pressing the key
    if (controller.right) {
        body.x_velocity += body.speed;
    }

    // Gravity:
    //      y_velocity is always ramping up (except when on ground)
    body.y_velocity += 0.5;

    // Vertical movement
    //      vertical movement follows y_velocity
    body.y += body.y_velocity;

    // Horizontal movement
    //      Horizontal movement follows x_velocity
    body.x += body.x_velocity;

    // Friction:
    //      velocities are always being reduced
    body.x_velocity *= 0.9;
    body.y_velocity *= 0.9;
    //! HOW DOES THIS LIMIT HORIZONTAL VELOCITY ??

    // Floor
    //      Contact with the floor stops effect from gravity
    if (body.y > CANVAS_HEIGTH - body.height - body.height) {
        body.jumping = false;
        body.y = CANVAS_HEIGTH - body.height - body.height;
        body.y_velocity = 0;
    }

    // If body goes off screen, teleport to the other side
    if (body.x < - body.width) {
        body.x = CANVAS_WIDTH;
    } else if (body.x > CANVAS_WIDTH) {
        body.x = - body.width;
    }

    // Clear canvas contents
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Canvas background
    ctx.beginPath();
    ctx.fillStyle = "darkgray";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);

    // Square
    ctx.beginPath();
    ctx.fillStyle = "pink";
    ctx.rect(body.x, body.y, body.width, body.height);
    ctx.fill();

    // Floor
    ctx.strokeStyle = "#777777";
    // ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGTH - body.height);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGTH - body.height);
    ctx.stroke();

    window.requestAnimationFrame(loop);

}

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
loop();
