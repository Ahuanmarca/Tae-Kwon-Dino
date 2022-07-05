class Level {
    constructor(levelInfo) {

        const { level, name, score } = levelInfo.metadata;
        const tileMapString = levelInfo.tileMapString;

        this.level = levelInfo.level;
        this.name = levelInfo.name;
        this.tileMap = getTileMap(levelInfo);

    }

}

function getTileMap(levelInfo) {

    const tileMapString = levelInfo.tileMapString.replaceAll("\n","").replaceAll(" ","");
    const levelLength = tileMapString.length / 2;

    const tileMap = []

    for (i = 0; i < levelLength; i++) {
        const tile = {};
        tile.type = tileMapString[i];
        tile.verticalPosition = tileMapString[i + levelLength];
        tileMap.push(tile);
    }

    return tileMap;

}