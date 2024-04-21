import { ValueProvider } from '@src/common/data/ValueProvider';
import { IModule } from '@src/common/data/Modules';
import { AiBot } from '@src/ai/data/AiBot';
import { AiChat } from '@src/ai/data/AIChat';


export class AIService implements IModule {

  public currentAiBot?:AiBot;

  public currentChat?:AiChat;

  public aiBotList:AiBot[] = [];

  constructor() {

  }

  initialize(): void {

  }

  start(): void {
  }

  afterStart(): void {
  }

  destroy(): void {
  }




}





