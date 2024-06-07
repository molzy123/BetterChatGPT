const { ipcRenderer } = window.require('electron');

export const MainWin = {
  send(body: any) {
    ipcRenderer.send('MainWin', body);
  },
  async call(body: any): Promise<any> {
    var result = await ipcRenderer.invoke('MainWinCall', body);
    console.log(result);
    return result;
  },

  sendAction(act: String, arg?: any) {
    this.send({ action: act, arg: arg });
  },
  async callAction(act: String, arg?: any): Promise<any> {
    return await this.call({ action: act, arg: arg });
  },

  setPin(pin: boolean) {
    this.sendAction('pin', pin);
  },
  setHide() {
    this.sendAction('hide');
  },
  openFile(path: string) {
    this.sendAction('openFile', path);
  },
  async getExcelFiles(path: string): Promise<any> {
    try {
      var result = await this.callAction('getExcelFiles', path);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  async searchSheet(text: string): Promise<{ filePath: string, sheetName: string }[] | undefined> {
    try {
      var result = await this.callAction('searchSheet', text);
      return result;
    } catch (e) {
      console.log(e);
    }
  }
};
