import {
  IAiChatDef,
  IAiChatGenerateChunkDef,
  IAiChatGenerateDef,
  IAiChatGenerateResponseDef,
  IAiChatMessageDef,
} from './AIDef';
import { AiChatMessage } from './AiChatMessage';
import { WeakObjectEvent } from '@src/common/Event/WeakObjectEventService';
import { AiApi } from '../mgr/AiApi';
import { Locator } from '@src/common/System/Locator';
import { AIService } from '../mgr/AIService';
import { AiBot } from './AiBot';
import { Role } from '@type/chat';

export class AiChat {
  id: string;
  messages: AiChatMessage[];
  start_time: string;
  bot: AiBot;
  isTemplate: boolean = false;

  public setTemplate(isTemplate: boolean) {
    this.isTemplate = isTemplate;
    WeakObjectEvent.fire(this);
  }

  private _title: string = 'New Chat';
  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    if (this._title != value) {
      this._title = value;
      this.updateChat();
    }
  }
  end_time: string;

  static fromJson(json: IAiChatDef): AiChat {
    const bot = Locator.fetch(AIService).getBotById(json.botId);
    if (bot == undefined) {
      throw new Error('AiBot not found');
    }
    if (json.messages == null) json.messages = [];
    return new AiChat(
      json.id,
      bot,
      json.name,
      json.messages,
      json.createTime,
      json.lastEditTime
    );
  }

  public getLastMessage():AiChatMessage {
    return this.messages[this.messages.length - 1];
  }

  public toJson(): IAiChatDef {
    let messageDefs = this.messages.map((message) => {
      return message.toJson();
    });
    return {
      id: this.id,
      botId: this.bot.id,
      name: this.title,
      messages: messageDefs,
      createTime: this.start_time,
      lastEditTime: this.end_time,
    };
  }

  constructor(
    id: string,
    aiBot: AiBot,
    chat_title: string,
    messageDefs: IAiChatMessageDef[],
    start_time: string,
    end_time: string
  ) {
    this.id = id;
    this.bot = aiBot;
    this._title = chat_title;
    this.messages = messageDefs.map((message) => {
      return AiChatMessage.fromJson(message, this);
    });
    this.start_time = start_time;
    this.end_time = end_time;
  }

  public refresh(message: AiChatMessage) {
    const index = this.messages.indexOf(message);
    if (message.role == 'assistant') {
      this.messages = this.messages.slice(0, index);
    } else {
      this.messages = this.messages.slice(0, index + 1);
    }
    //发送湖回答
    this.updateChat();
    this.generateChat();
  }

  public isMessageEmpty(): boolean {
    return this.messages.length == 0;
  }

  public upIndex(message: AiChatMessage) {
    const index = this.messages.indexOf(message);
    if (index == 0) return;
    this.messages[index] = this.messages[index - 1];
    this.messages[index - 1] = message;
    this.updateChat();
  }

  public downIndex(message: AiChatMessage) {
    const index = this.messages.indexOf(message);
    if (index == this.messages.length - 1) return;
    this.messages[index] = this.messages[index + 1];
    this.messages[index + 1] = message;
    this.updateChat();
  }

  public deleteMessage(message: AiChatMessage) {
    const index = this.messages.indexOf(message);
    this.messages.splice(index, 1);
    this.updateChat();
  }

  public addMessage(role:Role, content:string, index?: number) {
    const message = new AiChatMessage(role, content, this);
    if (index) {
      this.messages.splice(index, 0, message);
    } else {
      this.messages.push(message);
    }
    this.updateChat();
  }

  public updateChat() {
    AiApi.updateAiChat(this.toJson(), () => {
      WeakObjectEvent.fire(this);
    });
  }

  generate_title(): void {
    const user_message = this.messages[this.messages.length - 1].content;
    const assistant_message = this.messages[this.messages.length - 2].content;
    const message = new AiChatMessage(
      'user',
      `Generate a title in less than 6 words for the following message (language: Chinese Simple):\n"""\nUser: ${user_message}\nAssistant: ${assistant_message}\n"""`
    ,this);
    let configDef = this.bot.config.toJson();
    let arg: IAiChatGenerateDef = {
      ...configDef,
      messages: [message.toJson()],
    };
    AiApi.generateTitle(arg, (data: IAiChatGenerateResponseDef) => {
      console.log('generate title success', data.choices[0].message.content);
      if (data.choices[0].message.content != undefined) {
        this.title = data.choices[0].message.content;
      }
    });
  }

  generateChatOnce(question:string){
    this.addMessage("user", question);
    this.generateChat();
    return this.getLastMessage();
  }

  

  generateChat(): void {
    let configDef = this.bot.config.toJson();
    configDef.stream = true;
    let arg: IAiChatGenerateDef = {
      ...configDef,
      messages: this.messages.map((message) => {
        return message.toJson();
      }),
    };
    this.addMessage('assistant', '');
    const lastMessage = this.getLastMessage();
    console.log("generateChat");
    
    AiApi.generateChat(
      arg,
      (data: IAiChatGenerateChunkDef) => {
        lastMessage.content += data.choices[0].delta.content ?? '';
      },
      () => {
        this.updateChat();
      }
    );
  }

  public clone(): AiChat {
    let messageDefs = this.messages.map((message) => {
      return message.toJson();
    });
    return new AiChat(
      this.id,
      this.bot,
      this.title,
      messageDefs,
      Date.now().toString(),
      Date.now().toString()
    );
  }
}
