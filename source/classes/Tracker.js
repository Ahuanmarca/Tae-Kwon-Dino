export class CollisionTracker {
    constructor() {
    }

    /*
        CURRENTLY NOT IN USE!!
        I still want a Tracker Class that will take care of tracking all objects moving in the world
        This class could track for collisions, but maybe also for other interactions?

        Maybe the Tracker Class should just remember the objets to be tracked,
        and then call each one of the objects's own collision tracking methods ???
        If that's the case, maybe we just need a helper function, and not a class
        
        For now, I'm just calling trackCollisions() from the currentPlayer
        directly in the Game Loop (script.js)

        Still not sure how to do this 😕
    */

    trackGameObjects (hero, foes) {
        hero.state.isTakingDamage = false;
        
        for (let i = 0; i < foes.length; i++) {
                let foe = foes[i];
                const colRel = this.testCollision(hero, foe);

                if (foe.state.currentHealth > 0 && colRel) {
                    const {fromRight, fromLeft, fromTop, fromBottom} = colRel;
                    
                    if (fromBottom) { // hero kills foe
                        hero.state.velocityY -= 20;
                        foe.die();
                    } else { // hero damage and push back
                        hero.state.isTakingDamage = true;
                        hero.state.currentHealth -= 1;
                        fromRight && hero.turnRight();
                        fromLeft && hero.turnLeft();

                        hero.state.velocityY -= 10;
                        hero.state.isFacingRight && (hero.state.velocityX -= 7)
                        hero.state.isFacingLeft && (hero.state.velocityX += 7)
                    }
                }
            }
    }
}
