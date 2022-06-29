// Background stuff

const background = {
    baseSpeed: 0,
    width: 1024,
    height: 480,
    files: [
        {
            url: "assets/back.png",
            distance: 10,
        },
        {
            url: "assets/middle.png",
            distance: 3.5,
        },
        {
            url: "assets/near.png",
            distance: 1.5,
        },
        {
            url: "assets/ground.png",
            distance: 1,
        },
    ],
    layers: [],
}


const spriteInfo = {
    
    "metadata": {
        "fileRight": "assets/dino-right.png",
        "fileLeft": "assets/dino-left.png",
        "spriteWidth": 96,
        "spriteHeight": 72
    },
    
    "actions" : [
        ["idle", 4],
        ["walk", 6],
        ["kick", 4],
        ["hurt", 3],
        ["jump", 1],
        ["run", 6]
    ]
}

