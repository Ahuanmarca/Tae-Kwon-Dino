// Background stuff

const background = {
    baseSpeed: 0,
    width: 1024,
    height: 480,
    files: [
        {
            url: "assets/sprites/back.png",
            distance: 10,
        },
        {
            url: "assets/sprites/middle.png",
            distance: 3.5,
        },
        {
            url: "assets/sprites/near.png",
            distance: 1.5,
        },
        {
            url: "assets/sprites/ground.png",
            distance: 1,
        },
    ],
    layers: [],
}


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

