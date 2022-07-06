// Contents:
//      class Level
//      class Tile
//      class Layer
//      class Background


class Level {
    constructor(levelInfo) {
        this.level = levelInfo.metadata.level;
        this.name = levelInfo.metadata.name;
        this.tiles = createTiles(levelInfo.tilesInfo);
        this.tileMap = getTileMap(levelInfo);
        this.background = createBackground(levelInfo.backgroundInfo);

        this.length = Object.keys(this.tileMap).length * 64;
    }
}


class Tile {
    constructor(tileInfo) {
        const { name, u, v, width, height, platform, wall, file } = tileInfo;

        this.name = name;
        this.u = u;
        this.v = v;
        this.width = width;
        this.height = height;
        this.platform = platform;
        this.wall = wall;
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

    const tileMapString = levelInfo.tileMapString.replaceAll("\n","").replaceAll(" ","");
    const levelLength = tileMapString.length / 2;
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
    constructor(imageURL, distance, width, height, baseSpeed) {

        this.imageURL = imageURL;
        this.distance = distance;

        // Layer position (starts at x = 0, y = 0)
        this.y = 0;
        this.x = 0;

        // Width and height
        this.width = width;
        this.height = height;

        // Import image from file
        this.image = importImage(imageURL);

        // More distance = Less speed
        this.speed = baseSpeed / distance;

    }

    // CHANGE SPEED DINAMICALLY BASED ON OTHER FACTORS, LIKE CHARACTER POSITION....
    updateSpeed(baseSpeed) {
        this.speed = baseSpeed / this.distance;
    }

    // Update X position of current layer
    updatePosition() {
        if (this.x < -this.width) {
            this.x = 0;
        } else if (this.x > 0) {
            this.x = -this.width;
        } else {
            this.x = this.x - this.speed;
        }
    }

    // Draws the image two times so they can stitch together when scrolling
    draw() {
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

        this.baseSpeed = backgroundInfo.metadata.baseSpeed;
        this.width = backgroundInfo.metadata.width;
        this.height = backgroundInfo.metadata.height;

        this.layers = createLayers(backgroundInfo);
        
    }

    updateLayers(spriteSpeed) {
        this.layers.forEach(layer => {
            layer.updateSpeed(spriteSpeed);
            layer.updatePosition();
            layer.draw();
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
        const layer = new Layer(file.url, file.distance, width, height, baseSpeed);
        layers.push(layer);
    });
    
    return layers;
}


