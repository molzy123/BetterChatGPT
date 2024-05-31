const { ipcRenderer } = window.require('electron');


class AlertWin
{
    name:string = "AlertWin";
    constructor()
    {
    }

    setPin(pin:boolean)
    {
        ipcRenderer.send("alert-pin",pin);
    }

    


}