// Show variables below the Viewport



function showVariables(level, player, input, viewPort, gameState) {

    // Showing values below the character
    const animationLength = player.metadata.animations[player.state.actionSprite].length;
    const animationFrame = gameState.gameFrame % animationLength;
    const frameU = player.metadata.animations[player.state.actionSprite][animationFrame];




    
}

// document.querySelector("#n0").innerText = player.state.isIdle;
