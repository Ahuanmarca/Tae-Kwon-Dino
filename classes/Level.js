// Contents:
//      - Level Class
//      - getTileMap Function
//      - Tile Class


class Level {
    constructor(levelInfo) {

        this.level = levelInfo.metadata.level;
        this.name = levelInfo.metadata.name;
        this.tiles = createTiles(levelInfo.tilesInfo);
        this.tileMap = getTileMap(levelInfo);

    }

}


class Tile {
    constructor(tileInfo) {
        const { name, u, v, width, height, platform, wall, file } = tileInfo;

        this.name = name;
        this.u = u;
        this.v = v;
        this.width = width;
        this.height = height;
        this.platform = platform;
        this.wall = wall;
        this.file = importImage(file);
    }
}


function createTiles(tilesInfo) {
    const tiles = {};
    tilesInfo.forEach(tile => {
        tiles[tile.code] = new Tile(tile)
    })
    return tiles;
}


function getTileMap(levelInfo) {

    const tileMapString = levelInfo.tileMapString.replaceAll("\n","").replaceAll(" ","");
    const levelLength = tileMapString.length / 2;

    const tileMap = []

    for (i = 0; i < levelLength; i++) {
        const tile = {};
        tile.tileType = tileMapString[i];
        tile.verticalPosition = tileMapString[i + levelLength];
        tileMap.push(tile);
    }

    return tileMap;

}


const testLevel = new Level(LEVEL_01);




// function createTile(tileInfo) {
//     const tile = new Tile(tileInfo);
//     return tile;
// }


// Test
// function testTileClass() {
//     const testTileInfo = {
//         metadata: {
//             name: "Platform Tile",
//             u: 96,
//             v: 32,
//             width: 64,
//             height: 256,
//             platform: true,
//             wall: true,
//             file: "assets/sprites/tileset.png"
//         },
//     }
    
//     console.log("Texture location and dimensions may be innacurate")
//     const testTile = createTile(testTileInfo);
//     console.log(testTile);
// }
