const path = require("node:path")
const isDev = require('electron-is-dev');
const fs = require('fs');
module.exports = {
    assetPath(asset) {
        return path.join(
            __dirname,
            isDev ? `../public/${asset}` : `../dist/${asset}`
        );
    },

    findAllFiles(dir, callback) {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                return;
            }
            files.forEach(file => {
                const fullPath = path.join(dir, file.name);
                if (file.isDirectory()) {
                    this.findAllFiles(fullPath, callback); // Recursively search directories
                } else {
                    callback(fullPath, file.name); // Execute callback for each .cjs file
                }
            });
        });
    }
}