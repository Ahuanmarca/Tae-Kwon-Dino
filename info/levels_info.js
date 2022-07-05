
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

const level_01 = {

    metadata: {
        level: 1,
        name: "The Moab",
    },

    tileMapString: 
        `
        PPPDDPEWPPUUPPE
        222210011123333
        `,

    tilesInfo: {

        /* Y POSITIONS	
        low: 		CANVAS_HEIGHT - 64
        normal: 	CANVAS_HEIGHT - 128
        high: 		CANVAS_HEIGHT - 192
        very high: 	CANVAS_HEIGHT - 256 */

        width: 64,
        heigth: 256,
        
        "W": {
            name: "west-wall",
            u: 26, // texture location
            v: 32, // texture location
            platform: true,
            wall: true,
            file: "assets/sprites/tileset-simple.png"
        },
    
        "P": {
            name: "platform",
            u: 96,
            v: 32,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset-simple.png"
        },
    
        "E": {
            name: "east-wall",
            u: 192,
            v: 32,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset-simple.png"
        },
    
        "U": {
            name: "up-hill",
            u: 256,
            v: 32,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset-simple.png"
        },
    
        "D": {
            name: "down-hill",
            u: 352,
            v: 32,
            platform: true,
            wall: true,
            file: "assets/sprites/tileset-simple.png"
        },
    },

}
