import { Locator } from "./Locator";
import { AppState } from "./AppState";
import { AppStateEnum } from "./AppStateEnum";
import { ISystemModule } from "./IModule";
import { PopupService } from "../Popup/PopupService";
import { UserService } from "@src/user/mgr/UserService";

export class LoginState extends AppState {

  SystemModule:{new (): ISystemModule}[];

  constructor() {
    super();
    this.SystemModule= [
      PopupService,
      UserService
    ]
    this.state = AppStateEnum.LOGIN;
  }

    public enter(): void {
        this.SystemModule.forEach((moduleClass) => {
            const module = new moduleClass();
            Locator.register(moduleClass, module);
          });

        this.SystemModule.forEach((moduleClass) => {
            const module = Locator.fetch(moduleClass);
            module.start();
          });

          this.SystemModule.forEach((moduleClass) => {
            const module = Locator.fetch(moduleClass);
            module.initialize();
          });
    }
  
    public exit(): void {
      console.log('logout exit');
    }
  }
  