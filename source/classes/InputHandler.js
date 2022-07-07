class InputHandler {
    constructor() {
        this.keys = [];
        this.keysBool = {
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
                this.keysBool[e.key] = true;
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
                this.keysBool[e.key] = false;
            }
        })
    }
}


