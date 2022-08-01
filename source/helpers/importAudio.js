export function importAudio(audioURL) {
    const importedSound = new Audio();
    importedSound.src = audioURL;
    return importedSound;
}
