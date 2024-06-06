import { Locator } from '@src/common/System/Locator';
import { Role } from '../../../../BetterChatGPT/src/types/chat';
import { IAiChatMessageDef } from './AIDef';
import { AIService } from '../mgr/AIService';
import { WeakObjectEvent } from '@src/common/Event/WeakObjectEventService';
import { AiChat } from './AIChat';


export class AiChatMessage{
  name?: string;
  chat:AiChat;
  private _role: Role = "user";
  public get role(): Role {
    return this._role;
  }
  public set role(value: Role) {
    this._role = value;
    this.update()
  }
  private _content: string = "";
  public get content(): string {
    return this._content;
  }
  public set content(value: string) {
    this._content = value;
    this.update()
  }

  constructor( role: Role, content: string,chat:AiChat,name?:string,) {
    this.role = role;
    this.content = content;
    this.name = name;
    this.chat = chat;
  }

  static fromJson(json: IAiChatMessageDef, chat:AiChat): AiChatMessage {
    return new AiChatMessage(json.role, json.content,chat,json.name);
  }

  public toJson(): IAiChatMessageDef {
    return {
      name: this.name,
      role: this.role,
      content: this.content,
    }
  }

  public isLastIndex()
  {
    const chat = Locator.fetch(AIService).currentAiBot?.currentChat;
    
    if(chat)
    {
      return chat.messages[chat.messages.length-1] == this;
    }
    return false;
  }

  public save()
  {
    this.chat.updateChat();
  }

  public update()
  {
    WeakObjectEvent.fire(this);
  }

}