import { EnglishWordService } from "@src/english_word/mgr/EnglishWordService";
import { ContextMenuService } from "../ContextMenu/ContextMenuService";
import { AIService } from "@src/ai/mgr/AIService";
import { AppState } from "./AppState";
import { Locator } from "./Locator";
import { AppStateEnum } from "./AppStateEnum";
import { IModule } from "./IModule";
import { UserService } from "@src/user/mgr/UserService";
import { IAiBotDef } from "@src/ai/data/AIDef";

export class PlayState extends AppState {

  SessionModule: { new (): IModule }[] = [
    AIService,
    ContextMenuService,
    EnglishWordService
  ];

    constructor() {
      super();
      this.state = AppStateEnum.PLAY;
    }
  
    public enter(): void {
      
    const loginData:{bots: IAiBotDef[]|undefined} = {
        bots:Locator.fetch(UserService).user?.bots
    }
      this.SessionModule.forEach((moduleClass) => {
        const module = new moduleClass();
        Locator.register(moduleClass, module);
      });
      this.SessionModule.forEach((moduleClass) => {
        const module = Locator.fetch(moduleClass);
        module.initialize(loginData);
      });
      this.SessionModule.forEach((moduleClass) => {
        const module = Locator.fetch(moduleClass);
        module.start();
      });
    }
  
    public exit(): void {
      console.log('login exit');
      this.SessionModule.forEach((moduleClass) => {
        const module = new moduleClass();
        module.destroy();
      });
    }
  }