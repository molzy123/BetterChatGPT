import { Role } from '@type/chat';
import { AiBot } from '@src/ai/data/AiBot';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';
import { AIService } from '@src/ai/mgr/AIService';
import { AbstractModule } from '@src/common/System/AbstractModule'
import { Locator } from '@src/common/System/Locator'
import { AiChat } from '@src/ai/data/AIChat';
import { EventService } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';

export enum EnglishBotEnum {
    ARTICLE = "article",
}


export class EnglishWordService extends AbstractModule {
    
    botMap:Map<EnglishBotEnum,AiBot> = new Map();
    initialize(): void {
    }

    // 依赖于其他模块的初始化
    start(): void {
        const bot = Locator.fetch(AIService).getArticleBot()
        if(bot)this.botMap.set(EnglishBotEnum.ARTICLE,bot);
    }

    // 每次调用这个函数，都会生成一个新的对话
     public async generateArticle(words:string[]) {

        const articleBot = this.botMap.get(EnglishBotEnum.ARTICLE);
        const chat:AiChat|undefined = await articleBot?.newChat();
        if(!chat)
        {
            return;
        }
        const message = chat.generateChatOnce(words.join(" "));
        EventService.dispatchEvent(EventEnum.CURRENT_ARTICLE_CHANGED, message);
        return chat.getLastMessage();
    }
}
