class Tile {
    constructor(tileInfo) {
        const { name, u, v, width, heigth, platform, wall, file } = tileInfo.metadata;

        this.name = name;
        this.u = u;
        this.v = v;
        this.width = width;
        this.heigth = heigth;
        this.platform = platform;
        this.wall = wall;
        this.file = importImage(file);
    }
}

function createTile(tileInfo) {
    const tile = new Tile(tileInfo);
    return tile;
}



// Test
function testTileClass() {
    const testTileInfo = {
        metadata: {
            name: "Platform Tile",
            u: 48,
            v: 16,
            with: 128,
            heigth: 224,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    }
    
    const testTile = createTile(testTileInfo);
    console.log(testTile);
}
