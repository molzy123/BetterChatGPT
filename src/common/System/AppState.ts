import { AppStateEnum } from "./AppStateEnum";
import { IState } from "./IState";


export class AppState implements IState {
    private _state: AppStateEnum = AppStateEnum.NONE;
  
    public get state(): AppStateEnum {
      return this._state;
    }
  
    public set state(value: AppStateEnum) {
      this._state = value;
    }
  
    public enter(): void {
      console.log('enter');
    }
  
    public exit(): void {
      console.log('exit');
    }
  }