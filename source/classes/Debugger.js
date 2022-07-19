
class Debugger {

    constructor() {

    }

}


function getStateVariables(gameObject) {

    const stateVariables = {};

    for (key in gameObject.state) {
        stateVariables[key] = gameObject.state[key];
    }

}



