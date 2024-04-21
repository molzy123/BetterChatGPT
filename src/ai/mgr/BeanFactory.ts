import IAiBotCreateDef, {
  AiBotCreate, AiConfig,
  IAiBotDef,
  IAiChatDef,
  IAiChatMessageDef,
  IAiConfigDef,
} from '@src/ai/data/AIDef';
import { Role } from '@type/chat';
import { AiChat, AiChatMessage } from '@src/ai/data/AIChat';
import { AiBot } from '@src/ai/data/AiBot';
import createAiBotUI from '@src/ai/ui/CreateAiBotUI';

export const BeanFactory = {
  createAiConfig : function(jsonData: IAiConfigDef) {
    return new AiConfig(jsonData.model, jsonData.max_tokens, jsonData.temperature, jsonData.top_p, jsonData.presence_penalty, jsonData.frequency_penalty, jsonData.n, jsonData.seed, jsonData.stream);
  },
  createAiBot : function(jsonData: IAiBotDef) {
    const config = this.createAiConfig(jsonData.config);
    return new AiBot(jsonData.id, jsonData.user_id, jsonData.name, jsonData.summary, config);
  },
  createAiChat : function(jsonData: IAiChatDef) {
    let messages: IAiChatMessageDef[] = [];
    jsonData.messages.forEach((message) => {
      messages.push(this.createAiChatMessage(message.role, message.content));
    });
    return new AiChat(jsonData.id, jsonData.ai_bot_id, jsonData.chat_title, messages, jsonData.start_time, jsonData.end_time);
  },
  createAiChatMessage : function(role: Role, content: string) {
    return new AiChatMessage(role, content);
  },
  getDefaultAiChatFactory : function() {
    const jsonData: IAiChatDef = {
      id: '',
      ai_bot_id: '',
      chat_title: '',
      messages: [],
      start_time: '',
      end_time: ''
    }
    return this.createAiChat(jsonData);
  },
  getDefaultAiBotFactory: function(){
    const jsonData: IAiBotDef = {
      id: '',
      user_id: '',
      name: '',
      summary: '',
      config: {
        model: 'gpt-3.5-turbo',
        max_tokens: 4096,
        temperature: 0.5,
        top_p: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
        n: 16,
      }
    }
    return this.createAiBot(jsonData);
  },
  getDefaultAiBotBeanFactory:function (){
    return new AiBotCreate();
  }
}
