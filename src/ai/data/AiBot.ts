import type { IAiBotDef, IAiBotUpdateDef, IAiChatDef, IAiConfigDef } from '@src/ai/data/AIDef';
import { AiChat } from '@src/ai/data/AIChat';
import { AiConfig } from '@src/ai/data/AiConfig';
import { AiApi } from '@src/ai/mgr/AiApi';
import { WeakObjectEvent } from '@src/common/Event/WeakObjectEventService';

export class AiBot
{
  
  id: number = 0;
  userId: string|undefined;
  name: string = "机器人";
  description: string = "简单描述";
  config: AiConfig = new AiConfig();
  templateChat?: AiChat;
  templateId?: string;
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
    result.userId = json.userId;
    result.name = json.name;
    result.description = json.description;
    result.config = AiConfig.fromJson(json.config);
    result.initialize();
    console.log("templateId",json.templateId);
    result.templateId = json.templateId;
    return result;
  }

  public toJson(): IAiBotDef
  {
    return {
      id: this.id,
      userId: this.userId??"",
      name: this.name,
      description: this.description,
      config: this.config,
      templateId: this.templateChat?.id??""
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
    this.templateChat = this.chatList.find((chat) => chat.id == this.templateId);
    this.templateChat?.setTemplate(true); 
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

   public async newChat():Promise<AiChat | undefined>
  {
    if(this.chatList == undefined)return;
    const templateChat = this.templateChat;
    var chat:AiChat;
    if(templateChat)
    {
      chat = templateChat.clone();
    }else{
      chat = new AiChat( "", this, "New", [], "", "")
    }
    console.log("newChat",chat.toJson());
    
    await AiApi.createAiChat(chat.toJson(),(data:IAiChatDef)=>{
      console.log("createAiChat",data);
      chat = AiChat.fromJson(data)
      this.chatList?.unshift(chat);
      this.currentChat = chat;
      WeakObjectEvent.fire(this)
    })
    return chat;
  }

  public cloneCurrentChat()
  {
    if(this.currentChat)
    {
      const chat = this.currentChat.clone();
      AiApi.createAiChat(chat.toJson(),(response:IAiChatDef)=>{
        this.chatList?.unshift(AiChat.fromJson(response));
        WeakObjectEvent.fire(this)
      })
    }
  }
  setTemplate(chat: AiChat) {
    const updateDef:IAiBotUpdateDef = {
      id: this.id,
      templateId: chat.id
    }
    AiApi.setTemplate(updateDef,()=>{
      this.templateChat?.setTemplate(false);
      chat.setTemplate(true);
      this.templateChat = chat;
      WeakObjectEvent.fire(this)
    })
  }
}
