const zipafolder = require('zip-a-folder');

class ZipAFolder {

    static async main() {
        await zipafolder.ZipAFolder.zip('../game', '../game.love');
    }
}

ZipAFolder.main();