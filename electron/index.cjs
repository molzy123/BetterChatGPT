const Env = require('./core/Env.cjs');
await Env.init();
Env.resolveFileName();

const { app, shell, clipboard, dialog, download, BrowserWindow, Tray, Menu, MenuItem, ipcMain, } = require('electron');
const WindowFactory = require("./win/WindowFactory.cjs");
const StateMachine = require('./common/StateMachine.cjs');
const LoadState = require('./core/LoadState.cjs');
const RunState = require('./core/RunState.cjs');
const FileUtil = require('./common/util/FileUtil.cjs');
const ICON = '/public/icon-rounded.png';
let win = null;
const instanceLock = app.requestSingleInstanceLock();
const isMacOS = process.platform === 'darwin';

if (require('electron-squirrel-startup')) app.quit();

const appStateMachine = new StateMachine();
appStateMachine.addState(new LoadState());
appStateMachine.addState(new RunState());

const onUncaughtException = (error) => {
  dialog.showErrorBox('An error occurred', error.stack);
  process.exit(1);
}

const onSecondInstance = (event, commandLine, workingDirectory) => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
}

const onWindowAllClosed = () => {
  if (!isMacOS) {
    app.quit();
  }
}

// 托盘
const createTray = (win) => {
  const tray = new Tray(FileUtil.assetPath(!isMacOS ? ICON : ICON_TEMPLATE));

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
}

const onReady = async () => {
  win = WindowFactory.creteMain();
  app.tray = createTray(win);
}

const startApp = () => {
  appStateMachine.switchState('RunState');
  process.on('uncaughtException', onUncaughtException);
  if (!instanceLock) {
    app.quit();
  } else {
    app.on('second-instance', onSecondInstance);
    app.on('window-all-closed', onWindowAllClosed);
    app.whenReady().then(onReady);
  }
}


startApp();



