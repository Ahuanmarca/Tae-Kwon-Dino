export function trackCollisions (player, monsters) {

    player.state.isTakingDamage = false;

    for (let i = 0; i < monsters.length; i++) {
            let monster = monsters[i];

            if (monster.state.currentHealth > 0 && player.testCollision(player, monster)) {
                
                if (
                    // TODO Write conditions to ensure the player is stomping the monster
                    //      Current check not good enough, player can still kill monster from the side
                    player.state.y <= monster.state.y &&
                    player.state.isFalling
                ) { // player kills monster
                    player.state.velocityY -= 20;
                    monster.die();
                } else {
                    // player damage
                    player.state.isTakingDamage = true;
                    player.state.currentHealth -= 1;
                    // Make player face monster
                    player.state.x < monster.state.x && player.turnRight();
                    player.state.x > monster.state.x && player.turnLeft();
                    // Push back to opposing side
                    player.state.velocityY -= 10;
                    player.state.isFacingRight && (player.state.velocityX -= 7)
                    player.state.isFacingLeft && (player.state.velocityX += 7)
                }
            }
        }
}
