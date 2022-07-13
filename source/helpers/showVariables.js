// Show variables below the Viewport

function showVariables() {

    // Showing values below the character
    const animationLength = URU.metadata.animations[URU.state.action].length;
    const animationFrame = gameState.gameFrame % animationLength;
    const frameU = URU.metadata.animations[URU.state.action][animationFrame];

    document.querySelector("#showAction").innerText = URU.state.action;
    document.querySelector("#showDirection").innerText = URU.state.direction;
    document.querySelector("#showJumping").innerText = URU.state.jumping;
    document.querySelector("#showRunning").innerText = URU.state.running;

    document.querySelector('#showVelocityX').innerText = URU.state.velocityX;
    document.querySelector('#showVelocityY').innerText = URU.state.velocityY;
    document.querySelector('#showPositionX').innerText = URU.mapPosition.x;
    document.querySelector('#showPositionY').innerText = URU.mapPosition.y;


    document.querySelector("#showAnimationLength").innerText = animationLength;
    document.querySelector("#showAnimationFrame").innerText = animationFrame;
    document.querySelector("#showFrameCoordinate").innerText = frameU;

    // Level
    document.querySelector("#showLevelLength").innerText = LEVEL_01.length;

    document.querySelector("#showBackX").innerText = LEVEL_01.background.layers[0].x;
    document.querySelector("#showMiddleX").innerText = LEVEL_01.background.layers[1].x;
    document.querySelector("#showNearX").innerText = LEVEL_01.background.layers[2].x;
    // document.querySelector('#showGroundX').innerText = LEVEL_01.background.layers[3].x;

    document.querySelector("#showLoopFrame").innerText = gameState.loopFrame;
    document.querySelector("#showGameFrame").innerText = gameState.gameFrame;
    document.querySelector("#showInput").innerText = INPUT.keys;

    // Viewport
    document.querySelector("#showViewportAnchor").innerText = VIEW_PORT.anchor;
    document.querySelector("#showOffset").innerText = "TODO";
    document.querySelector("#showLeftTile").innerText = URU.state.leftTile.type;
    document.querySelector("#showCenterTile").innerText = URU.state.centerTile.type;
    document.querySelector("#showRightTile").innerText = URU.state.rightTile.type;

}

