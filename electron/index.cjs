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
  ipcRenderer,
} = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const { log } = require("node:console");
let win = null;
const instanceLock = app.requestSingleInstanceLock();
const isMacOS = process.platform === 'darwin';


if (require('electron-squirrel-startup')) app.quit();

const PORT = isDev ? '5173' : '51735';
const ICON = 'icon-rounded.png';
const ICON_TEMPLATE = 'iconTemplate.png';
const setupLinksLeftClick = (win) => {
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

const setupContextMenu = (win) => {
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
};

function createWindow() {
  autoUpdater.checkForUpdatesAndNotify();

  win = new BrowserWindow({
    autoHideMenuBar: true,
    show: false,
    icon: assetPath(ICON),
    webPreferences:{
      nodeIntegration: true, // 启用 Node.js 集成
      contextIsolation: false, // 禁用沙箱
    }
  });

  createTray(win);

  // win.maximize();
  win.show();

  log("is dev",isDev)
  // isDev || createServer();
  createServer();
 // Ensure Vite server is running before loading URL
 const startUrl = isDev ? `http://localhost:${PORT}/` : `file://${path.join(__dirname, '../dist/index.html')}`;
  win.loadURL(startUrl);
  // win.loadFile('./index.html');

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  setupLinksLeftClick(win);
  setupContextMenu(win);

  return win;
}

const assetPath = (asset) => {
  return path.join(
    __dirname,
    isDev ? `../public/${asset}` : `../dist/${asset}`
  );
};

const createTray = (win) => {
  const tray = new Tray(assetPath(!isMacOS ? ICON : ICON_TEMPLATE));
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
};

app.on('window-all-closed', () => {
  if (!isMacOS) {
    app.quit();
  }
});

process.on('uncaughtException', (error) => {
  // Perform any necessary cleanup tasks here
  dialog.showErrorBox('An error occurred', error.stack);

  // Exit the app
  process.exit(1);
});

if (!instanceLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    win = createWindow();
    ipcMain.handle("ping",()=>"pong")
  });
}

const createServer = () => {
  const PORT = isDev ? '5174' : '51735'; // 使用不同的端口避免冲突
  // Dependencies
  const http = require('http');
  const fs = require('fs');
  
  // MIME types for different file extensions
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.wasm': 'application/wasm',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
  };

  // Create a http server
  const server = http.createServer((request, response) => {
    log(">>>>>>>>>>>>>>>>>>>listen")
    if(request.method == "GET" && request.url === "/trigger")
    {
      console.log("Triggering popup"); // 添加日志
      const alert = new BrowserWindow({
        autoHideMenuBar: true,
        show: false,
        height: 300,
        width: 300,
        icon: assetPath(ICON),
        webPreferences:{
          nodeIntegration: true, // 启用 Node.js 集成
          contextIsolation: false, // 禁用沙箱
        }
      });
      const startUrl = isDev ? `http://localhost:5173/alert` : `file://${path.join(__dirname, '../dist/index.html')}`;
      alert.loadURL(startUrl);
      alert.show();
      win.webContents.send("show-popup");
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: "Popup triggered" }));
    }
  });

  log(">>>>PORT",PORT)
  // Listen for request on port ${PORT}
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
  });
};
