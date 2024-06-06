import { UserApi } from '@src/user/mgr/UserApi';
import { StorageService } from '@src/common/data/StorageService';
import { User } from '@src/user/data/User';
import { AbstractModule } from '@src/common/data/AbstractModule';
import { changeState } from '@src/main';
import { AppStateEnum } from '@src/common/data/Modules';
import { Locator } from '@src/common/data/Locator';
import { AIService } from '@src/ai/mgr/AIService';
import { UserAllDef } from '../data/UserDef';

export class UserService {
  private _accessToken: string = '';
  get accessToken(): string {
    return this._accessToken;
  }
  private set accessToken(value: string) {
    StorageService.setItem('accessToken', value);
    this._accessToken = value;
  }

  public user?: User;

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
      changeState(AppStateEnum.LOGIN);
    };
    UserApi.getUser(success);
  }

  public logout(): void {
    this.accessToken = '';
    this.user = undefined;
    changeState(AppStateEnum.LOGOUT);
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
