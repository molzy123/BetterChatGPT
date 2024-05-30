

const { contextBridge, ipcRenderer } = require('electron')
const path = require('path');
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping")
  // 除函数之外，我们也可以暴露变量
});

contextBridge.exposeInMainWorld('api', {
    getDirname: () => __dirname, // 暴露 __dirname
  });