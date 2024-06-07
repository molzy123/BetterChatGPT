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
const ExcelMgr = require("./table/ExcelMgr.cjs");
const PORT = isDev ? '5173' : '51735';
const ICON = 'icon-rounded.png';
const ICON_TEMPLATE = 'iconTemplate.png';
const isMacOS = process.platform === 'darwin';

module.exports = {
    createServer() {
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
        log(">>>>PORT", PORT)
        // Listen for request on port ${PORT}
        server.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}/`);
        });
    },
    createTray(win) {
        const tray = new Tray(this.assetPath(!isMacOS ? ICON : ICON_TEMPLATE));
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show',
                click: () => {
                    win.maximize();
                    win.show();
                },
            },
            {
                label: 'Exit',
                click: () => {
                    app.isQuiting = true;
                    app.quit();
                },
            },
        ]);

        tray.on('click', () => {
            win.maximize();
            win.show();
        });
        tray.setToolTip('Better ChatGPT');
        tray.setContextMenu(contextMenu);

        return tray;
    },
    creteMain() {
        autoUpdater.checkForUpdatesAndNotify();
        let win = new BrowserWindow({
            autoHideMenuBar: true,
            show: false,
            icon: this.assetPath(ICON),
            webPreferences: {
                nodeIntegration: true, // 启用 Node.js 集成
                contextIsolation: false, // 禁用沙箱
            }
        });

        this.createTray(win);

        // win.maximize();
        win.show();

        log("is dev", isDev)
        // isDev || createServer();
        this.createServer();
        // Ensure Vite server is running before loading URL
        const startUrl = isDev ? `http://localhost:${PORT}/` : `file://${path.join(__dirname, '../dist/index.html')}`;
        win.loadURL(startUrl);
        // win.loadFile('./index.html');
        win.webContents.openDevTools({ mode: 'detach' });
        // if (isDev) {

        // }
        ipcMain.on("MainWin", (event, body) => {
            if (body.action == "openFile") {
                var filePath = body.arg
                // 判断是否是Excel文件，如果是则使用Excel打开
                if (filePath.endsWith('.xlsm') || filePath.endsWith('.xlsx')) {
                    // 使用默认程序打开文件
                    shell.openPath(filePath);
                }
            } else if (body.action == "getExcelFiles") {
                // 获取指定目录下的所有Excel文件
                const ExcelUtil = require("./table/ExcelUtil.cjs");
                ExcelUtil.getExcelFiles(body.arg).then(files => {
                    event.sender.send("MainWin", { action: "getExcelFiles", arg: files });
                });
            }


        });

        ipcMain.handle("MainWinCall", async (event, body) => {
            if (body.action == "getExcelFiles") {
                // 获取指定目录下的所有Excel文件
                const ExcelUtil = require("./table/ExcelUtil.cjs");
                var result = await ExcelUtil.getExcelFiles(body.arg)
                return result;
            } else if (body.action == "searchSheet") {
                var result = ExcelMgr.searchSheet(body.arg);
                return result;
            }
        });
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