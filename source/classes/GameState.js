class GameState {
    constructor() {

        this.isActive = false; // TODO Chek notes at the end
        this.onTitle = true;
        this.onGameOver = false;
        this.onGameEnding = false;
        this.onTransition = false;
        this.acceptingInput = true;

        this.currentLevel = 0;
        this.gameFrame = 0;
        this.loopFrame = 0;
        this.staggerFrames = 10;

        this.currentMonsters = undefined;

        this.validStates = { // TODO Chek notes at the end
            isActive: "isActive",
            onTitle: "onTitle",
            onGameOver: "onGameOver",
            onGameEnding: "onGameEnding",
            onTransition: "onTransition",
            acceptingInput: "acceptingInput"
        }
    }

    updateFrames() {
        (this.loopFrame % this.staggerFrames == 0) && this.gameFrame++;
        this.loopFrame++;
    }

    increaseLevel() {
        if (this.currentLevel < 2) {
            this.currentLevel += 1;
        } else {
            this.setState.onGameEnding();
        }
    }

    setState = { // TODO Chek notes at the end
        onTitle: () => this.toggleBooleans(this.validStates.onTitle),
        isActive: () => this.toggleBooleans(this.validStates.isActive),
        onGameOver: () => this.toggleBooleans(this.validStates.onGameOver),
        onGameEnding: () => this.toggleBooleans(this.validStates.onGameEnding),
        onTransition: () => this.toggleBooleans(this.validStates.onTransition),
        acceptingInput: () => this.toggleBooleans(this.validStates.acceptingInput),
    }
   
    // newState is the key of the property that will become true, the rest will become false
    toggleBooleans(newState) {
        for (let key in this) {
            if (typeof this[key] === 'boolean') {
                this[key] = key === newState;
            }
        }
    }

    restartGame() {
        this.setState.onTitle();
        this.currentLevel = 0;
    }
}

// NOTES AT THE END!
// TODO Fix redundancy between states, validStates and setState functions
// validStates can be populated with a helper function
// ? How can I populates setState with functions?
// I need a function that returns functions,
// then run that funtion on a loop to fill the setState object

