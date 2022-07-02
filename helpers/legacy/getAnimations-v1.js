/*
I want to create an array that contains the
neccesary information to animate the sprites,
something like...

const animations = {
    idle: [0, 96, 192, 288],
    walk: [384, 480, 576, 672, 768, 864].
    kick: [960, 1056, 1152, 1248],
    hurt: [1344, 1440, 1536],
    jump: [1632],
    run: [1728, 1824, 1920, 2016, 2112, 2208],
}
​
I need to know:
    - Dimensions of the sprite sheet
    - Name of each animation
    - Number of frames per animation
*/


// getAnimations(spriteInfo) {
//     let j = 0;
//     spriteInfo.animationsStates.forEach(state => {
//         let frames = [];
//         for (let i = 0; i < state.frames; i++) {
//             frames.push(j * spriteWidth);
//             j++;
//         }
//         this.animations[state.name] = frames;
//     });
// }


function getAnimations(gameObject, spriteInfo) {

    const { animationsStates } = spriteInfo;
    const { spriteWidth, spriteHeight } = spriteInfo.metadata;    

    if (spriteInfo.metadata.singleRow) {

        // Begin from first frame on the row
        let currentFrame = 0;

        animationsStates.forEach(state => {
            let frames = [];
            for (let i = 0; i < state.frames; i++) {
                frames.push(currentFrame);
                currentFrame += spriteWidth;
            }
            gameObject.metadata.animations[state.name] = frames;
        });
        
    } else {

        animationsStates.forEach((state, index) => {
            let frames = [];
            for (let j = 0; j < state.frames; j++) {
                let u = j * spriteWidth;
                let v = index * spriteHeight;
                frames.push({u: u, v: v});
            }
            gameObject.metadata.animations[state.name] = frames;
        });
    }
}
