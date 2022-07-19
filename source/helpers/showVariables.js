
// Show Variables from an Object Literal
//      Creates a table
//      Fills it with variables from an object
//      Appends the table to the DOM !!

// The table is Styled on style.css, need to classList the needed classes

function showVariables(objectName, gameState, gameObject) {

    if (gameState.loopFrame <= 0) {
        const newTable = document.createElement("table");
        const tableHeader = document.createElement("caption");
        tableHeader.innerText = objectName;
        newTable.appendChild(tableHeader);
        const rows = [];
        for (key in gameObject) {

            const newRow = document.createElement("tr");

            const variableName = document.createElement("td");
            variableName.innerText = key;
            variableName.onselectstart = function () { 
                return false; 
            }

            const variableValue = document.createElement("td");
            variableValue.classList.add("variableValues");
            variableValue.id = key;
            variableValue.innerText = gameObject[key];
            variableValue.onselectstart = function() { return false; }


            newRow.appendChild(variableName);
            newRow.appendChild(variableValue);
            rows.push(newRow);

        }
        for (let row of rows) {
            newTable.appendChild(row);
        }

        // TODO I don't like hardcoding the ID from the DOM
        document.querySelector("#variablesDisplayContainer").appendChild(newTable);
    
    } else {
        for (key in gameObject) {
            document.getElementById(key).innerText = gameObject[key];
        }
    }

}

// const animationLength = player.metadata.animations[player.state.actionSprite].length;
// const animationFrame = gameState.gameFrame % animationLength;
// const frameU = player.metadata.animations[player.state.actionSprite][animationFrame];
