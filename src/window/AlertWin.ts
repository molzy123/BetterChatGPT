const { ipcRenderer } = window.require('electron');

export const AlertWin = {
  send(body: any) {
    ipcRenderer.send('AlertWin', body);
  },

  sendAction(act: String, arg?: any) {
    this.send({ action: act, arg: arg });
  },

  setPin(pin: boolean) {
    this.sendAction('pin', pin);
  },
  setHide() {
    this.sendAction('hide');
  },
};
