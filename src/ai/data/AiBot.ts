import type { IAiBotDef, IAiChatDef, IAiConfigDef } from '@src/ai/data/AIDef';
import { AiChat } from '@src/ai/data/AIChat';
import { AiConfig } from '@src/ai/data/AiConfig';
import { AiApi } from '@src/ai/mgr/AiApi';
import { EventService } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';
import { WeakObjectEvent } from '@src/common/Event/WeakObjectEventService';




export class AiBot
{
  id: string = "";
  user_id: string|undefined;
  name: string = "机器人";
  summary: string = "简单描述";
  config: AiConfig = new AiConfig();
  private _chatList?: AiChat[] | undefined;
  public get chatList(): AiChat[] | undefined {
    return this._chatList;
  }
  public set chatList(value: AiChat[] | undefined) {
    if(value == this._chatList || value == undefined){
      return;
    }
    this._chatList = value;
    WeakObjectEvent.fire(this)
  }
  _currentChat?: AiChat;
  isSelect: boolean = false;

  
  get currentChat(): AiChat| undefined
  {
    return this._currentChat;
  }

  
  set currentChat(value: AiChat| undefined)
  {
    if (value == undefined || value == this._currentChat)
    {
      return;
    }
    this._currentChat = value;
    WeakObjectEvent.fire(this)
  }

  
  static fromJson(json: IAiBotDef): AiBot
  {
    const result = new AiBot();
    result.id = json.id;
    result.user_id = json.user_id;
    result.name = json.name;
    result.summary = json.summary;
    result.config = AiConfig.fromJson(json.config);
    result.initialize();
    return result;
  }

  public toJson(): IAiBotDef
  {
    return {
      id: this.id,
      user_id: this.user_id??"",
      name: this.name,
      summary: this.summary,
      config: this.config,
    };
  }

  constructor()
  {
  }

  initialize(): void
  {
    AiApi.getAiChatListByBotId(this.id, this.onGetAiChatListComplete);
  }

  onGetAiChatListComplete = (data: IAiChatDef[]) =>
  {
    this.chatList = data.map((item) =>
    {
      return AiChat.fromJson(item);
    });
    this.currentChat = this.chatList[0];
  };

  public deleteChat(chat:AiChat)
  {
    if(this.chatList == undefined)
    {
      return;
    }
    const index = this.chatList.indexOf(chat);
    if(index >= 0)
    {
      this.chatList.splice(index,1);
    }
    // todo delete chat
    AiApi.deleteAiChat(chat.id,()=>{
      WeakObjectEvent.fire(this)
    });
    
  }

  public newChat()
  {
    if(this.chatList == undefined)return;
    const defaultChat = new AiChat( "", this, "新对话", [], "", "")
    AiApi.createAiChat(defaultChat.toJson(),()=>{
      this.chatList?.push(defaultChat);
      WeakObjectEvent.fire(this)
    })
  }

  public cloneCurrentChat()
  {
    const chatDef = this.currentChat?.toJson();
    if (chatDef)
    {
      const chat = AiChat.fromJson(chatDef);
      this.chatList?.push(chat);
      this.currentChat = chat;
      AiApi.createAiChat(chatDef,()=>{
        WeakObjectEvent.fire(this)
      })
    }
  }
}
