import { AiBot } from '@src/ai/data/AiBot';

import { AiApi } from '@src/ai/mgr/AiApi';
import { IAiBotCreateDef, IAiBotDef } from '@src/ai/data/AIDef';
import { EventService } from '@src/common/Event/EventService';
import { Locator } from '@src/common/data/Locator';
import { EventEnum } from '@src/common/Event/EventEnum';
import { useEffect, useState } from 'react';
import { AbstractModule } from '@src/common/data/AbstractModule';
import { UserService, UserStateEnum } from '@src/user/mgr/UserService';
import { WeakObjectEvent } from '@src/common/Event/WeakObjectEventService';

export function useEventValue<T>(value: T):T {
  const [_, setSymbol] = useState<Symbol>();
  useEffect(() => {
    const callback = () => {
      setSymbol(Symbol());
    };
    if (typeof value == 'object' && value != null) {
      let unBind:(()=>void)|undefined;

      unBind = WeakObjectEvent.bind(value, callback);

      return () => {
        unBind ? unBind() : undefined;
      };
    }else{
      console.log("bindObject failed",value);
    }
  }, []);

  return value;
}



export class AIService extends AbstractModule {
  
  private _currentAiBot: AiBot | undefined = undefined;
  set currentAiBot(value: AiBot | undefined) {
    if (value == undefined || value == this._currentAiBot) {
      return;
    }

    if (this._currentAiBot != undefined) {
      this._currentAiBot.isSelect = false;
    }

    this._currentAiBot = value;
    value.isSelect = true;
    EventService.dispatchEvent(EventEnum.CURRENT_BOT_CHANGED, this._currentAiBot);
  }
  get currentAiBot() {
    return this._currentAiBot;
  }

  public _aiBotList: AiBot[] = [];
  set aiBotList(value: AiBot[]) {
    console.trace(">>>")
    this._aiBotList = value;
  }
  get aiBotList() {
    return this._aiBotList;
  }

  private aiBotMap: Map<number, AiBot> = new Map<number, AiBot>();

  public createAiBot(data: IAiBotCreateDef, cb?: Function) {
    AiApi.createAiBot(data, (data: IAiBotDef) => {
      const aiBot = AiBot.fromJson(data);
      this.aiBotList.push(aiBot);
      this.aiBotMap.set(aiBot.id, aiBot);
      if (cb) {
        cb(aiBot);
      }
    });
  }

  public onGetAiBotListComplete = (data: IAiBotDef[]) => {
    this.aiBotList = data.map((item) => {
      const aiBot = AiBot.fromJson(item);
      this.aiBotMap.set(aiBot.id, aiBot);
      return aiBot;
    });
    this.currentAiBot = this.aiBotList[this.aiBotList.length - 1];
    EventService.dispatchEvent(EventEnum.BOT_INIT_COMPLETE, this.aiBotList);
  };

  public getBotById(id:number)
  {
    return this.aiBotMap.get(id);
  }

  getArticleBot(): AiBot | undefined {
    console.log(">>>>>>>>>>>>>>>>初始化", this.aiBotMap.get(13));
    return this.getBotById(13);
  }
}
