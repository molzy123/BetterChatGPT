import { AIService } from '@src/ai/mgr/AIService';
import { UserService } from '@src/user/mgr/UserService';
import { PopupService } from '@src/common/Popup/PopupService';
import { ContextMenuService } from '../ContextMenu/ContextMenuService';
import { EnglishWordService } from '@src/english_word/mgr/EnglishWordService';
import { Locator } from './Locator';
import { EventService } from '../Event/EventService';
import { EventEnum } from '../Event/EventEnum';

export interface IModule {
  initialize(): void;
  start(): void;
  destroy(): void;
}

export enum AppStateEnum {
  NONE = 'NONE',
  LOGOUT = 'LOGOUT',
  LOGIN = 'LOGIN',
}

export class StateMachine {
  state: AppState | undefined = undefined;

  states: Map<AppStateEnum, AppState> = new Map();

  constructor() {}

  public addState(state: AppState): void {
    this.states.set(state.state, state);
  }

  public changeState(state: AppStateEnum): void {
    if (this.state) {
      this.state.exit();
    }
    this.state = this.states.get(state);
    if (this.state) {
      this.state.enter();
    }

    EventService.dispatchEvent(EventEnum.APP_STATE_CHANGE, this.state?.state);
  }

  public isState(state: AppStateEnum): boolean {
    return this.state?.state === state;
  }

  public isNotState(state: AppStateEnum): boolean {
    return this.state?.state !== state;
  }
}

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

export interface IState {
  enter(): void;

  exit(): void;
}

export class LoginState extends AppState {
  moduleClasses: { new (): IModule }[] = [
    AIService,
    ContextMenuService,
    EnglishWordService,
  ];

  constructor() {
    super();
    this.state = AppStateEnum.LOGIN;
  }

  public enter(): void {
    console.log('login enter');
    this.moduleClasses.forEach((moduleClass) => {
      const module = new moduleClass();
      Locator.register(moduleClass, module);
    });
    this.moduleClasses.forEach((moduleClass) => {
      const module = Locator.fetch(moduleClass);
      module.initialize();
    });
    this.moduleClasses.forEach((moduleClass) => {
      const module = Locator.fetch(moduleClass);
      module.start();
    });
  }

  public exit(): void {
    console.log('login exit');
    this.moduleClasses.forEach((moduleClass) => {
      const module = new moduleClass();
      module.destroy();
    });
  }
}

export class LogoutState extends AppState {
  public enter(): void {
    console.log('logout enter');
  }

  public exit(): void {
    console.log('logout exit');
  }
}
