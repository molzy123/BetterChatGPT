const { app, shell, clipboard, dialog, download, BrowserWindow, Tray, Menu, MenuItem, ipcMain, } = require('electron');
// const path = require('path');
const path = require("node:path")
const isDev = require('electron-is-dev');
const BaseWin = require('./BaseWin.cjs');
const FileUtil = require('../common/util/FileUtil.cjs');
const ICON = 'icon-rounded.png';

class MainWin extends BaseWin {
    constructor() {
        super({
            autoHideMenuBar: true,
            show: false,
            icon: FileUtil.assetPath(ICON),
            webPreferences: {
                nodeIntegration: true, // 启用 Node.js 集成
                contextIsolation: false, // 禁用沙箱
            }
        });
        this.name = "MainWin";
        const PORT = isDev ? '5173' : '51735';
        this.startUrl = isDev ? `http://localhost:${PORT}/` : `file://${path.join(__dirname, '../dist/index.html')}`;
    }

    init() {
        super.init();
        this.createServer();
    }

    bindRpcEvent() {
        this.registerRpcAction("openFile", (filePath) => {
            // 判断是否是Excel文件，如果是则使用Excel打开
            if (filePath.endsWith('.xlsm') || filePath.endsWith('.xlsx')) {
                // 使用默认程序打开文件
                shell.openPath(filePath);
            }
        })

        this.registerRpcActionCall("getExcelFiles", async (dir) => {
            // 获取指定目录下的所有Excel文件
            const ExcelUtil = require("../module/ExcelUtil.cjs");
            var result = await ExcelUtil.getExcelFiles(dir)
            return result;
        })

        this.registerRpcActionCall("searchSheet", (sheetName) => {
            var result = ExcelMgr.searchSheet(sheetName);
            return result;
        })
    }


    createServer() {
        /*
        const PORT = isDev ? '5174' : '51735'; // 使用不同的端口避免冲突
        // Dependencies
        const http = require('http');
        const fs = require('fs');
        // Create a http server
        const server = http.createServer((request, response) => {
            if (request.method == "POST" && request.url === "/trigger") {
                alert.show();
                alert.focus();
                // 读取body内容
                let body = "";
                request.on('data', (chunk) => {
                    body += chunk.toString();
                    alert.webContents.send("storage", { channel: "AI", message: body });
                });
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: "Popup triggered" }));
            }
        });
        // Listen for request on port ${PORT}
        server.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}/`);
        });
        */
    }
}

module.exports = MainWin;