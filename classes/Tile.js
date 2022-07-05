// class Tile {
//     constructor(tileInfo) {
//         const { name, u, v, width, heigth, platform, wall, file } = tileInfo.metadata;

//         this.name = name;
//         this.u = u;
//         this.v = v;
//         this.width = width;
//         this.heigth = heigth;
//         this.platform = platform;
//         this.wall = wall;
//         this.file = importImage(file);
//     }
// }

// function createTile(tileInfo) {
//     const tile = new Tile(tileInfo);
//     return tile;
// }



// // Test
// function testTileClass() {
//     const testTileInfo = {
//         metadata: {
//             name: "Platform Tile",
//             u: 96,
//             v: 32,
//             width: 64,
//             heigth: 256,
//             platform: true,
//             wall: true,
//             file: "assets/sprites/tileset.png"
//         },
//     }
    
//     console.log("Texture location and dimensions may be innacurate")
//     const testTile = createTile(testTileInfo);
//     console.log(testTile);
// }
