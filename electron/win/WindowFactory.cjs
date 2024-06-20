// const path = require('path');
const path = require("node:path")

const {
    app,
    shell,
    clipboard,
    dialog,
    download,
    BrowserWindow,
    Tray,
    Menu,
    MenuItem,
    ipcMain,
} = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const { log } = require("node:console");
const { load } = require("@dqbd/tiktoken/load");
const ICON = 'icon-rounded.png';
const MainWin = require("./MainWin.cjs");

module.exports = {
    creteMain() {
        autoUpdater.checkForUpdatesAndNotify();
        let win = new MainWin();
        win.init();
        this.setupLinksLeftClick(win);
        this.setupContextMenu(win);
        return win;
    },
    assetPath(asset) {
        return path.join(
            __dirname,
            isDev ? `../public/${asset}` : `../dist/${asset}`
        );
    },
    setupContextMenu(win) {
        win.webContents.on('context-menu', (_, params) => {
            const { x, y, linkURL, selectionText } = params;

            const template = [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' },
                { type: 'separator' },
                { role: 'toggleDevTools' },
            ];

            const spellingMenu = [];

            if (selectionText && !linkURL) {
                // Add each spelling suggestion
                for (const suggestion of params.dictionarySuggestions) {
                    spellingMenu.push(
                        new MenuItem({
                            label: suggestion,
                            click: () => win.webContents.replaceMisspelling(suggestion),
                        })
                    );
                }

                // Allow users to add the misspelled word to the dictionary
                if (params.misspelledWord) {
                    spellingMenu.push(
                        new MenuItem({
                            label: 'Add to dictionary',
                            click: () =>
                                win.webContents.session.addWordToSpellCheckerDictionary(
                                    params.misspelledWord
                                ),
                        })
                    );
                }

                if (spellingMenu.length > 0) {
                    spellingMenu.push({ type: 'separator' });
                }

                template.push(
                    { type: 'separator' },
                    {
                        label: `Search Google for "${selectionText}"`,
                        click: () => {
                            shell.openExternal(
                                `https://www.google.com/search?q=${encodeURIComponent(
                                    selectionText
                                )}`
                            );
                        },
                    },
                    {
                        label: `Search DuckDuckGo for "${selectionText}"`,
                        click: () => {
                            shell.openExternal(
                                `https://duckduckgo.com/?q=${encodeURIComponent(selectionText)}`
                            );
                        },
                    }
                );
            }

            if (linkURL) {
                template.push(
                    { type: 'separator' },
                    {
                        label: 'Open Link in Browser',
                        click: () => {
                            shell.openExternal(linkURL);
                        },
                    },
                    {
                        label: 'Copy Link Address',
                        click: () => {
                            clipboard.writeText(linkURL);
                        },
                    },
                    {
                        label: 'Save Link As...',
                        click: () => {
                            dialog.showSaveDialog(
                                win,
                                { defaultPath: path.basename(linkURL) },
                                (filePath) => {
                                    if (filePath) {
                                        download(win, linkURL, { filename: filePath });
                                    }
                                }
                            );
                        },
                    }
                );
            }

            Menu.buildFromTemplate([...spellingMenu, ...template]).popup({
                window: win,
                x,
                y,
            });
        });
    },
    setupLinksLeftClick(win) {
        win.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: 'deny' };
        });
    },
    createAlert() {
        alert = new BrowserWindow({
            autoHideMenuBar: true,
            show: false,
            icon: this.assetPath(ICON),
            webPreferences: {
                nodeIntegration: true, // 启用 Node.js 集成
                contextIsolation: false, // 禁用沙箱
            },
            height: 300,
            width: 300,
            frame: false,
            transparent: true,
        });
        alert.loadURL("http://localhost:5173/alert");

        ipcMain.on("AlertWin", (event, body) => {
            if (body.action == "pin") {
                alert.setAlwaysOnTop(body.arg)
            }
        });

        return alert;
    }
}