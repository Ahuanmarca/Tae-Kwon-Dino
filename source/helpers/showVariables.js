// Show variables below the Viewport

const showingVariables = {
    
    // URU (Player)
    player: {
        animation: true,
        direction: true,
        jumpingState: true,
        runningState: true,
        groundedState: true,
        velocityX: true,
        velocityY: true,
        positionX: true,
        positionY: true,
        animationLength: true,
        animationFrame: true,
        animationFrameCoordinate: true,

    }







}

function showVariables(level, player, input, viewPort) {

    // Showing values below the character
    const animationLength = player.metadata.animations[player.state.actionSprite].length;
    const animationFrame = gameState.gameFrame % animationLength;
    const frameU = player.metadata.animations[player.state.actionSprite][animationFrame];

    document.querySelector("#showAction").innerText = player.state.action;
    document.querySelector("#showDirection").innerText = player.state.direction;
    document.querySelector("#showJumping").innerText = player.state.jumping;
    document.querySelector("#showRunning").innerText = player.state.running;
    document.querySelector("#showIsGrounded").innerText = player.state.isGrounded;
    

    document.querySelector('#showVelocityX').innerText = player.state.velocityX;
    document.querySelector('#showVelocityY').innerText = player.state.velocityY;
    document.querySelector('#showPositionX').innerText = player.mapPosition.x;
    document.querySelector('#showPositionY').innerText = player.mapPosition.y;


    document.querySelector("#showAnimationLength").innerText = animationLength;
    document.querySelector("#showAnimationFrame").innerText = animationFrame;
    document.querySelector("#showFrameCoordinate").innerText = frameU;

    // Level
    document.querySelector("#showLevelLength").innerText = level.length;

    document.querySelector("#showBackX").innerText = level.background.layers[0].x;
    document.querySelector("#showMiddleX").innerText = level.background.layers[1].x;
    document.querySelector("#showNearX").innerText = level.background.layers[2].x;

    document.querySelector("#showLoopFrame").innerText = gameState.loopFrame;
    document.querySelector("#showGameFrame").innerText = gameState.gameFrame;
    document.querySelector("#showInput").innerText = input.keys;

    // Viewport
    document.querySelector("#showViewportAnchor").innerText = viewPort.anchor;
    document.querySelector("#showOffset").innerText = "TODO";
    document.querySelector("#showLeftTile").innerText = player.state.leftTile.type;
    document.querySelector("#showCenterTile").innerText = player.state.centerTile.type;
    document.querySelector("#showRightTile").innerText = player.state.rightTile.type;

    // New state variables
    document.querySelector("#n0").innerText = player.state.isIdle;
    document.querySelector("#n1").innerText = player.state.isWalking;
    document.querySelector("#n2").innerText = player.state.isRunning;
    document.querySelector("#n3").innerText = player.state.isJumping;
    document.querySelector("#n4").innerText = player.state.isFalling;
    document.querySelector("#n5").innerText = player.state.isGrounded;
    document.querySelector("#n6").innerText = player.state.isFacingRight;
    document.querySelector("#n7").innerText = player.state.isFacingLeft;

}

