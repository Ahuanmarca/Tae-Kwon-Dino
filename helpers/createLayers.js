// ? Question: Should I write this kind of super small function directly inside the class that is going to use it?

// This function uses the background Info to create an array filled with
// instances of the Layer Class, then returns the array.
// The idea is to use this function exclusively inside the Background Class.

// function createLayers(backgroundInfo) {
//     const layers = [];
//     backgroundInfo.files.forEach(file => {
//         const layer = new Layer(file.url, file.distance);
//         layers.push(layer);
//     });
//     return layers;
// }