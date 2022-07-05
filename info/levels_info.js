/*

    Tile map is defined with a 2-row String
    
    Types on first row
        P: latform
        W: west-wall
        E: wast-wall
        U: up-hill
        D: down-hill
    
    Heights on second row
        0: low
        1: normal
        2: high
        3: very high

    const stringMap = `
        PPPDDPEWPPUUPPE
        222210011123333
    `

*/

const LEVEL_01 = {

    metadata: {
        level: 1,
        name: "The Moab",
        tileWidth: 64,
        tileHeight: 256,
    },

    tileMapString: `
        PPPDDPEWPPUUPPE
        222210011123333
    `,


    // Array with tile properties

    tilesInfo: [
        
        /* Y POSITIONS	
        low: 		CANVAS_HEIGHT - 64
        normal: 	CANVAS_HEIGHT - 128
        high: 		CANVAS_HEIGHT - 192
        very high: 	CANVAS_HEIGHT - 256 */
    
        {
            code: "W", 
            name: "west-wall",
            u: 26, // texture location
            v: 32, // texture location
            width: 64,
            height: 256,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset-simple.png"
        },
    
        {
            code: "P",
            name: "platform",
            u: 96,
            v: 32,
            width: 64,
            height: 256,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset-simple.png"
        },
    
        {
            code: "E",
            name: "east-wall",
            u: 192,
            v: 32,
            width: 64,
            height: 256,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset-simple.png"
        },
    
        {
            code: "U",
            name: "up-hill",
            u: 256,
            v: 32,
            width: 64,
            height: 256,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset-simple.png"
        },
    
        {
            code: "D",
            name: "down-hill",
            u: 352,
            v: 32,
            width: 64,
            height: 256,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset-simple.png"
        }
    ],

}
