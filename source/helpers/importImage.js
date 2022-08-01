export function importImage(imageURL) {
    const importedImage = new Image();
    importedImage.src = imageURL;
    return importedImage;
}
