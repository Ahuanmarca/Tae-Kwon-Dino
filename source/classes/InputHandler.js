// Handrles
//      Array containing the keys as strings
//      Number of keys being pressed
//      Dictionary with pressed keys as booleans 

export class InputHandler {
    constructor() {
        this.keys = [];
        this.keysDict = {
            KeyQty: 0,
            ArrowDown: false,
            ArrowUp: false,
            ArrowLeft: false,
            ArrowRight: false,
            Shift: false,
            v: false,
        }
        window.addEventListener('keydown', e => {
            if (    e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Shift' ||
                    e.key === 'v' ) {
                this.keys.indexOf(e.key) === -1 && this.keys.push(e.key);
                this.keysDict[e.key] = true;
                this.keysDict.KeyQty = this.keys.length;
            }
        })
        window.addEventListener('keyup', e => {
            if (    e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' && this.keys.indexOf('ArrowUp') != -1 ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Shift' ||
                    e.key === 'v' ) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
                this.keysDict[e.key] = false;
                this.keysDict.KeyQty = this.keys.length;
            }
        })
    }
}


