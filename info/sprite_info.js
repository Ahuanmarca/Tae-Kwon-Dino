const spriteInfo = {
    
    metadata: {
        fileRight: "assets/sprites/dino-right.png",
        fileLeft: "assets/sprites/dino-left.png",
        spriteWidth: 96,
        spriteHeight: 72,
        singleRow: true,
    },
    
    animationsStates: [

        {
            name: "idle",
            frames: 4,            
        },
        {
            name: "walk",
            frames: 6,            
        },
        {
            name: "kick",
            frames: 4,            
        },
        {
            name: "hurt",
            frames: 3,            
        },
        {
            name: "jump",
            frames: 1,            
        },
        {
            name: "run",
            frames: 6,            
        },
    ]

}

/*
    Platform:
    - y position can be:
    -       CANVAS_HEIGHT - tilesInfo.platform.metadata.height
    -       CANVAS_HEIGHT - tilesInfo.leftWall.metadata.height
    -           In this case, we need 4 darFillers below the platform
    
    LeftWall and RightWall:
    - y position can be:
    -       CANVAS_HEIGHT - tilesInfo.leftWall.metadata.height

    LeftSolpe and RightSlope:
    
    


*/

const tilesInfo = {

    platform: {
        metadata: {
            name: "Platform Tile",
            u: 96,
            v: 32,
            with: 64,
            heigth: 128,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    },

    leftWall: {
        metadata: {
            name: "Left Wall Tile",
            u: 26,
            v: 32,
            with: 38,
            heigth: 192,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    },

    rightWall: {
        metadata: {
            name: "Right Wall Tile",
            u: 192,
            v: 32,
            with: 32,
            heigth: 192,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    },

    leftSlope: {
        metadata: {
            name: "Left Slope Tile",
            u: 256,
            v: 32,
            with: 64,
            heigth: 128,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    },

    rightSlope: {
        metadata: {
            name: "Right Slope Tile",
            u: 352,
            v: 32,
            with: 64,
            heigth: 128,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    },

    darkFiller: {
        metadata: {
            name: "Dark Filler Tile",
            u: 96,
            v: 192,
            with: 32,
            heigth: 32,
            platform: false,
            wall: false,
            file: "assets/sprites/tileset.png"
        },
    },

}