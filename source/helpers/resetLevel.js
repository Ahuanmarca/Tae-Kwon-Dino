export function resetLevel(currentLevel, currentPlayer) {
    console.log("Restarting Player & Monsters Positions");

    const playerPosition = currentLevel.startingState.playerPosition;
    currentPlayer.state.x = playerPosition[0];
    currentPlayer.state.y = playerPosition[1];

    for (let i = 0; i < currentLevel.monsters.length; i++) {
        // console.log(currentLevel.monsters)
        // console.log(currentLevel.startingState.monsters[i])
        currentLevel.monsters[i].state.x = currentLevel.startingState.monsters[i][1];
        currentLevel.monsters[i].state.y = currentLevel.startingState.monsters[i][2];

    }
}

