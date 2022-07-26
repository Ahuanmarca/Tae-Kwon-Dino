// Contents:
//      class Level
//      class Tile
//      class Layer
//      class Background


class Level {
    constructor(levelInfo) {
        this.level = levelInfo.metadata.level;
        this.name = levelInfo.metadata.name;
        this.tileWidth = levelInfo.metadata.tileWidth;
        this.tileHeight = levelInfo.metadata.tileHeight;
        this.levelHeight = levelInfo.metadata.levelHeight;

        this.tileTypes = levelInfo.tileTypes;
        this.tiles = createTiles(levelInfo.tilesInfo);
        this.tileMap = getTileMap(levelInfo);
        this.background = createBackground(levelInfo.backgroundInfo);
        this.length = Object.keys(this.tileMap).length * levelInfo.metadata.tileWidth;

        this.gravity = levelInfo.metadata.gravity;
        this.horizontalFriction = levelInfo.metadata.horizontalFriction;
        this.verticalFriction = levelInfo.metadata.verticalFriction;
        this.borderBarrier = levelInfo.metadata.borderBarrier;

    }

    getTileInfo(x) {
        const index = Math.round(x - (x % this.tileWidth));
        const tile = this.tileMap[index];
        return tile;
    }

    getGroundHeight(x) {
        const info = this.getTileInfo(x);

        // const { type: tileType, x: tileX, y: tileY } = info;
        const { platform, slope, width: tileWidth } = this.tiles[info.type];

        // start and end of slope
        const y1 = info.y + slope[0];
        const y2 = info.y + slope[1];

        // Offset is:
        // Distance from tileX to cX, in percentage of the tile
        const offset = (x - info.x) / tileWidth;
        // console.log(offset);

        if (offset < 0.5 && info.type === "W") {
            return this.levelHeight*2;
        } else if (offset > 0.5 && info.type === "E") {
            return this.levelHeight*2;
        } else if (info.type === "H") {
            return this.levelHeight*2;
        } else {
            return y1*(1-offset) + y2*offset;
        }

    }
}


class Tile {
    constructor(tileInfo) {
        const { name, 
            u, 
            v, 
            width, 
            height, 
            platform,
            wall, 
            slope, 
            file } = tileInfo;

        this.name = name;
        this.u = u;
        this.v = v;
        this.width = width;
        this.height = height;
        this.platform = platform;
        this.wall = wall;
        this.slope = slope;
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

    let tileMapString = "";
    levelInfo.tileMapString.forEach(line => {
        for (char of line) {
            tileMapString = tileMapString + char;
        }
    });


    const levelLength = tileMapString.length / 2; // TODO Don't use hard coded value
    const tileWidth = levelInfo.metadata.tileWidth;
    const levelHeight = levelInfo.metadata.levelHeight;

    const tileMap = {}

    for (i = 0; i < levelLength; i++) {
        const tile = {};
        tile.type = tileMapString[i];
        tile.y = levelHeight - (parseInt(tileMapString[i + levelLength])+1)*64;

        tile.x = i * tileWidth;

        tileMap[i*tileWidth] = tile;
    }

    return tileMap;

}


class Layer {
    constructor(imageURL, depth, width, height) {

        this.imageURL = imageURL;
        this.depth = depth; // Bigger means further from the screen

        // Layer position (starts at x = 0, y = 0)
        this.y = 0;
        this.x = 0;

        // Width and height
        this.width = width;
        this.height = height;

        // Import image from file
        this.image = importImage(imageURL);

    }

    // Update X position of current layer
    updatePosition(anchor) {
        
        this.x = -anchor / this.depth;

    }

    // Draws the image two times so they can stitch together when scrolling
    draw(context) {
        context.drawImage(
            // Image file
            this.image, 
            // Position on Canvas
            Math.floor(this.x), this.y, this.width, this.height
        );
        context.drawImage(
            // Image file
            this.image, 
            // Position on Canvas
            Math.floor(this.x + this.width), this.y, this.width, this.height
        );
    }
}


// The Background class collects all layers and controls them

class Background {
    constructor(backgroundInfo) {

        this.width = backgroundInfo.metadata.width;
        this.height = backgroundInfo.metadata.height;

        this.layers = createLayers(backgroundInfo);
        
    }

    updateLayers(anchor, context) {
        this.layers.forEach(layer => {
            layer.updatePosition(anchor);
            layer.draw(context);
        });
    }
}


function createBackground(backgroundInfo) {
    const createdBackground = new Background(backgroundInfo);
    return createdBackground;
}


function createLayers(backgroundInfo) {
    const layers = [];
    const { width, height, baseSpeed } = backgroundInfo.metadata;

    backgroundInfo.files.forEach(file => {
        const layer = new Layer(file.url, file.depth, width, height, baseSpeed);
        layers.push(layer);
    });
    
    return layers;
}


