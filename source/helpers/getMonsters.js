function getMonsters(startingState, monstersInfo) {
    const monsterArray = [];
    for (let monster of startingState.monsters) {
        //                            First argument = position,     second argument = Info
        const tmpMonst = new Monster({x: monster[1], y: monster[2]}, monstersInfo[monster[0]]);
        monsterArray.push(tmpMonst);
    }
    return monsterArray;
}
