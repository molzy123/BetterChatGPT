import { IModule } from '@src/common/data/Modules';
import { UserApi } from '@src/user/mgr/UserApi';
import { Locator } from '@src/common/data/Locator';
import { StorageService } from '@src/common/data/StorageService';
import { User } from '@src/user/data/User';
import { UserAllDef, UserDef } from '@src/user/data/UserDef';
import { EventService } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';
import { AbstractModule } from '@src/common/data/AbstractModule';
import { ApiResponse } from '@src/ai/mgr/AiApi';
import { AIService } from '@src/ai/mgr/AIService';


export enum UserStateEnum {
  LOGOUT = 'LOGOUT',
  LOGIN = 'LOGIN',
}

export class UserService extends AbstractModule {
  private _accessToken: string = '';
  get accessToken(): string {
    return this._accessToken;
  }
  private set accessToken(value: string) {
    StorageService.setItem("accessToken", value)
    this._accessToken = value;
    this.state = value === '' ? UserStateEnum.LOGOUT : UserStateEnum.LOGIN;
  }

  private _state:UserStateEnum = UserStateEnum.LOGOUT;
  public get state():UserStateEnum{
    return this._state;
  }
  private set state(value:UserStateEnum){
    if (this._state === value) {
      return;
    }
    this._state = value;
    EventService.dispatchEvent(this._state == UserStateEnum.LOGIN ? EventEnum.LOGIN : EventEnum.LOGOUT);
    EventService.dispatchEvent(EventEnum.LOGIN_STATE_CHANGE,value);
  }

  public user?:User;

  public login(username: string, password: string, cb?: Function): void {
    const success = (response:any) => {
      if (cb !== undefined) {
        cb(response);
      }
      this.accessToken = response.token;
    };
    UserApi.getToken(username, password, success);
  }

  public logout(): void {
    this.accessToken = '';
    this.user = undefined;
  }

  public register(username: string, password: string, email: string, cb?: Function): void {
    const success = async (data: any) => {
      if (cb !== undefined) {
        cb(data);
      }
    };
    UserApi.registerUser(username, password, email, success);
  }

  start(): void {
    this.accessToken = StorageService.getItem("accessToken");
    this.updateUser()
  }

  public updateUser():void
  {
    if(this.accessToken != ''){
      const success = async (data: UserAllDef) => {
        this.user = User.fromJson(data)
        Locator.fetch(AIService).onGetAiBotListComplete(this.user.bots)
      };
      UserApi.getUser(success)
    }
  }
}