const Module = require('module');
const FileUtil = require('../common/util/FileUtil.cjs');
module.exports = {
    async init() {
        this.cjsFilePath = {};
        await FileUtil.findAllFiles("../", (fullPath, fileName) => {
            if (fileName.endsWith(".cjs")) {
                fileName = fileName.replace(".cjs", "");
                this.cjsFilePath[fileName] = fullPath;
            }
        });

    },

    resolveFileName() {
        const originalResolveFilename = Module._resolveFilename;
        Module._resolveFilename = function (request, parent, isMain, options) {
            // request 是一个路径地址，提取出文件名
            const newFileName = request.split("/").pop().replace(".cjs", "");
            if (this.cjsFilePath[newFileName] !== undefined) {
                return originalResolveFilename.call(this, this.cjsFilePath[request], parent, isMain, options);
            } else {
                return originalResolveFilename.call(this, request, parent, isMain, options);
            }

        };
    }



}