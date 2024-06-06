
import { UserApi } from '@src/user/mgr/UserApi';
import { StorageService } from '@src/common/System/StorageService';
import { User } from '@src/user/data/User';
import { AbstractSystemModule } from '@src/common/System/AbstractModule';
import { changeState } from '@src/main';
import { UserAllDef } from '../data/UserDef';
import { AppStateEnum } from '@src/common/System/AppStateEnum';
import { StorageEnum } from '@src/common/System/StorageEnum';

export class UserService extends AbstractSystemModule {
  
  private _accessToken: string = '';
  get accessToken(): string {
    return this._accessToken;
  }
  private set accessToken(value: string) {
    StorageService.setItem(StorageEnum.accessToken, value);
    this._accessToken = value;
  }

  public user?: User;


  public initialize(): void {
    this.accessToken = StorageService.getItem(StorageEnum.accessToken) || '';
    if (this.accessToken !== '') {
      this._getLoginData();
    }
  }

  
  public login(username: string, password: string, cb?: Function): void {
    const success = (response: any) => {
      if (cb !== undefined) {
        cb(response);
      }
      this.accessToken = response.token;
      this._getLoginData();
    };
    UserApi.getToken(username, password, success);
  }

  private _getLoginData(): void {
    const success = async (data: UserAllDef) => {
      this.user = User.fromJson(data);
      changeState(AppStateEnum.PLAY);
    };
    UserApi.getUser(success);
  }

  public logout(): void {
    this.accessToken = '';
    this.user = undefined;
    changeState(AppStateEnum.LOGIN);
  }

  public register(
    username: string,
    password: string,
    email: string,
    cb?: Function
  ): void {
    const success = async (data: any) => {
      if (cb !== undefined) {
        cb(data);
      }
    };
    UserApi.registerUser(username, password, email, success);
  }
}
