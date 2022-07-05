const level_01 = {

    metadata: {
        level: 1,
        name: "The Moab",
        score: {
            title: "Expansion",
            authod: "Ansimuz",
            link: "https://soundcloud.com/ansimuz/expansion",
        },
        tileWidth: 64,
        tileHeight: 256,
    },

    tileMapString: 
        `
        PPPDDPEWPPUUPPE
        222210011123333
        `,

}



/*

    TILE MAPS ARE DEFINED BY SIMPLE STRING CODES

    Tile string codes:
    - Types on first row
    - Heights on second row
    - Length of string / 2 = number of tiles on the whole level
    
    P: Platform
    W: West wall
    E: East wall
    U: Uphill slope
    D: Downhill slope
    .: Pit, hole (no tiles)

    0: low
    1: normal
    2: high
    3: very high

    Example:
    Reproducing the image from the artist's site
    https://img.itch.zone/aW1hZ2UvMTMyNDcyNS83NzAzNzE3LnBuZw==/347x500/2ogaUw.png


    `
    PPPDDPEWPPUUPPE
    222210011123333
    `
    ! THE LINE BREAK NEEDS TO BE ADRESSED 🙄


*/