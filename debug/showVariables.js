function showVariables() {
        // Showing values below the character
        document.querySelector("#showAction").innerText = URU.state.action;
        document.querySelector("#showDirection").innerText = URU.state.direction;
        document.querySelector("#showJumping").innerText = URU.state.jumping;
        document.querySelector("#showRunning").innerText = URU.state.running;
        document.querySelector("#showAnimationLength").innerText = animationLength;
        document.querySelector("#showAnimationFrame").innerText = animationFrame;
        document.querySelector("#showFrameCoordinate").innerText = frameX;
        document.querySelector("#showLoopFrame").innerText = loopFrame;
        document.querySelector("#showGameFrame").innerText = gameFrame;
        document.querySelector("#showBackX").innerText = background.layers[0].x;
        document.querySelector("#showMiddleX").innerText = background.layers[1].x;
        document.querySelector("#showNearX").innerText = background.layers[2].x;
        document.querySelector('#showGroundX').innerText = background.layers[3].x;
}