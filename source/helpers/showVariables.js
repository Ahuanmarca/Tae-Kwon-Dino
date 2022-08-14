/*
Show Variables from a gameObject in real time
    Creates a table
    Fills it with variables from an object
    Appends the table to the DOM
    Updates the variables on each loop
*/

// TODO refactor this function to Debugger Class
// TODO fix: can't show some attributes because they are objects

export function showVariables(objectName, gameState, gameObject) {

    if (gameState.loopFrame > 0) {
        for (const key in gameObject) {
            document.getElementById(objectName+key).innerText = gameObject[key];
        }
    } else {
        const table = document.createElement("table");
        const caption = document.createElement("caption");
        caption.innerText = objectName;
        table.append(caption);

        for (const key in gameObject) {
            const row = document.createElement("tr");
            const attribute = document.createElement("td");
            const value = document.createElement("td");

            attribute.innerText = key;
            value.classList.add("variableValues"); // hardcoded CSS class selector
            value.id = objectName+key; // avoid tags having the same id
            value.innerText = gameObject[key];
            
            row.append(attribute, value);
            table.append(row);
        }
        document.querySelector("#variablesDisplayContainer").append(table); // hardcoded HTML id
    }
}

// TODO used to show other usefull data that's computed on the fly... should I include those again?
//      const animationLength = player.metadata.animations[player.state.actionSprite].length;
//      const animationFrame = gameState.gameFrame % animationLength;
//      const frameU = player.metadata.animations[player.state.actionSprite][animationFrame];
