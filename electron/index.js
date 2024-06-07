const {
  app,
  dialog,
} = require('electron');
const WindowFactory = require("./WindowFactory.js");
let win = null;
let alert = null;
const instanceLock = app.requestSingleInstanceLock();
const isMacOS = process.platform === 'darwin';

if (require('electron-squirrel-startup')) app.quit();

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
    win = WindowFactory.creteMain();
    alert = WindowFactory.createAlert();
  });
}


