class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', e => {
            if (    e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Shift' ||
                    e.key === 'v' ) {
                this.keys.indexOf(e.key) === -1 && this.keys.push(e.key);
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
            }
        })
    }
}

