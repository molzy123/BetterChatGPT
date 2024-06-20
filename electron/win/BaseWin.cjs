const { app, shell, clipboard, dialog, download, BrowserWindow, Tray, Menu, MenuItem, ipcMain, } = require('electron');
// const path = require('path');
const path = require("node:path")
const isDev = require('electron-is-dev');

class BaseWin extends BrowserWindow {
    constructor(options) {
        super(options);
        this.rpcAction = {};
        this.rpcActionCall = {}
        this.name = "BaseWin";
        this.startUrl = "";
    }

    init() {
        this.loadURL(this.startUrl);
        this.on('ready-to-show', () => {
            this.show();
        });
        this.on('closed', () => {
            this.destroy();
        });
        ipcMain.on(this.name, (event, body) => {
            if (this.rpcAction[body.action]) {
                this.rpcAction[body.action](body.arg)
            }
        });
        ipcMain.handle(this.name + "Call", async (event, body) => {
            if (this.rpcActionCall[body.action]) {
                return await this.rpcActionCall[body.action](body.arg)
            }
        });
        this.bindRpcEvent();
        // this.webContents.on('context-menu', this.onContextMenu);
    }

    onContextMenu(e, props) {

    }

    show() {
        super.show();
        if (isDev) {
            this.webContents.openDevTools({ mode: 'detach' });
        }
    }

    bindRpcEvent() {
    }

    registerRpcAction(action, callback) {
        this.rpcAction[action] = callback;
    }

    registerRpcActionCall(action, callback) {
        this.rpcActionCall[action] = callback;
    }
}

module.exports = BaseWin;