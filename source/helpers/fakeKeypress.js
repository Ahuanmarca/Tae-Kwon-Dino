export function fakeKeypress (keys) {
    const fakedKeys = {
        keysDict: {
            KeyQty: 0,
            ArrowDown: keys.indexOf("ArrowDown") === -1 ? false : true,
            ArrowUp: keys.indexOf("ArrowUp") === -1 ? false : true,
            ArrowLeft: keys.indexOf("ArrowLeft") === -1 ? false : true,
            ArrowRight: keys.indexOf("ArrowRight") === -1 ? false : true,
            Shift: keys.indexOf("Shift") === -1 ? false : true,
            v: keys.indexOf("v") === -1 ? false : true,
        }
    }
    return fakedKeys;
}
