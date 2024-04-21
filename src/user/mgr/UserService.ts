import { IModule } from '@src/common/data/Modules';

export class UserService implements IModule{
  private _accessToken:string = "";

  get accessToken():string {
    return this._accessToken;
  }

  set accessToken(value:string) {
    this._accessToken = value;
  }

  public login(username:string, password:string):void {

  }

  public logout():void {

  }

  public register(username:string, password:string):void {

  }



  constructor() {

  }

  destroy(): void {
  }

  initialize(): void {
  }

  start(): void {
  }
}