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
    Y POSITIONS	
	low: 		CANVAS_HEIGHT - 64
	normal: 	CANVAS_HEIGHT - 128
	high: 		CANVAS_HEIGHT - 192
	very high: 	CANVAS_HEIGHT - 256

	DIMENSIONS
	platform: 	64 * 256
	wall: 		64 * 256
	slope:		64 * 256
*/

const tilesInfo = {

    leftWall: {
        metadata: {
            name: "left-wall",
            u: 26,
            v: 32,
            with: 64,
            heigth: 256,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    },

    platform: {
        metadata: {
            name: "platform",
            u: 96,
            v: 32,
            with: 64,
            heigth: 256,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    },

    rightWall: {
        metadata: {
            name: "right-wall",
            u: 192,
            v: 32,
            with: 64,
            heigth: 256,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    },

    leftSlope: {
        metadata: {
            name: "left-slope",
            u: 256,
            v: 32,
            with: 64,
            heigth: 256,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    },

    rightSlope: {
        metadata: {
            name: "right-slope",
            u: 352,
            v: 32,
            with: 64,
            heigth: 256,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset.png"
        },
    },

}