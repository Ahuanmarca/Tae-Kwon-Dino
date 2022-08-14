
class Debugger {

    constructor() {

    }

    showVariables(objectName, gameState, gameObject) {

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
}