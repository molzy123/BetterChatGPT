import React from 'react';
import useStore from '@store/store'; // 导入自定义Hook：使用store状态管理
import { useTranslation } from 'react-i18next'; // 导入第三方库：用于多语言翻译
import { ChatInterface, MessageInterface } from '@type/chat'; // 导入自定义类型
import { getChatCompletionStream } from '@api/api'; // 导入API请求方法
import { parseChunk } from '@api/helper'; // 导入辅助函数：解析SSE事件源
import { limitMessageTokens, updateTotalTokenUsed } from '@utils/messageUtils'; // 导入辅助函数
import { _defaultChatConfig } from '@constants/chat'; // 导入默认聊天配置常量
import { IAiChatDef } from '@src/ai/data/AIDef'; // 导入官方API端点常量
import { getClientError } from '@utils/api';
import { Locator } from '@src/common/data/Locator';
import { AIService } from '@src/ai/mgr/AIService';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';
import { User } from '@src/user/data/User';
import { UserService } from '@src/user/mgr/UserService';

// 自定义Hook：使用提交功能
const useSubmit = () => {
  const { t, i18n } = useTranslation('api'); // 初始化国际化翻译
  const error = useStore((state) => state.error); // 获取error状态
  const apiEndpoint = "http://127.0.0.1:8000/ai/"
  const apiKey = Locator.fetch(UserService).accessToken
  const setGenerating = useStore((state) => state.setGenerating); // 获取并更新setGenerating状态
  const generating = useStore((state) => state.generating); // 获取generating状态
  const currentAiBot = Locator.fetch(AIService).currentAiBot; // 获取当前AI助手
  const currentChat = currentAiBot?.currentChat
  
  // 提交表单方法
  const handleSubmit = async () => {
    if (generating || !currentChat || ! currentAiBot) return;
    setGenerating(true); // 设置生成中状态为true
    currentChat.addMessage(new AiChatMessage("assistant",""))
    try {
      let stream;
      if (currentChat.messages.length === 0){
        throw new Error(getClientError("No messages submitted!")); // 如果没有消息被提交，则抛出错误：未提交消息
      }

      const messagesDef = currentChat.messages.map((message,index) => {
        return message.toJson()
      })
      const messages = limitMessageTokens(
        messagesDef,
        currentAiBot.config.max_tokens,
        currentAiBot.config.model,
      ); // 限制消息的token数量

      if (messages.length === 0){
        throw new Error(getClientError('Message exceed max token!')); // 如果没有消息被提交，则抛出错误：未提交消息
      }

      if (apiKey) {
        // 使用自定义ApiKey
        stream = await getChatCompletionStream(
          apiEndpoint,
          messages,
          currentAiBot.config,
          apiKey,
        );
      }

      if (stream) {
        if (stream.locked){
          throw new Error(getClientError('Oops, the stream is locked right now. Please try again')); // 如果流被锁定，则抛出错误
        }

        const reader = stream.getReader(); // 获取可读流对象
        let reading = true;
        let partial = ''; // 保存部分消息内容
        while (reading && useStore.getState().generating) {
          const { done, value } = await reader.read(); // 读取流中的数据
          const result = parseChunk(
            partial + new TextDecoder().decode(value),
          ); // 解析事件源中的数据
          partial = '';

          if (result === '[DONE]' || done)
          {
            reading = false;
          } else
          {
            const resultString = result.reduce((output: string, curr) => {
              if (typeof curr === 'string') {
                partial += curr;
              } else {
                const content = curr.choices[0]?.delta?.content ?? null;
                if (content) output += content;
              }
              return output;
            }, '');

            const lastMessage = Locator.fetch(AIService).currentAiBot?.currentChat?.getLastMessage()
            if (lastMessage != null)
            {
                lastMessage.content += resultString
            }
          }
        }

        if (useStore.getState().generating) {
          reader.cancel('Cancelled by user'); // 用户取消生成过程
        } else {
          reader.cancel('Generation completed'); // 生成完成
        }

        reader.releaseLock(); // 释放流的锁
        stream.cancel(); // 取消流
      }

      // 更新聊天中使用的token数量
      const countTotalTokens = useStore.getState().countTotalTokens;

      if (currentChat && countTotalTokens) {
        const model = currentAiBot.config.model;
        const messages = currentChat.messages;
        updateTotalTokenUsed(
          model,
          messages.slice(0, -1),
          messages[messages.length - 1],
        );
      }
    }catch (error) {
    }
    setGenerating(false); // 设置生成中状态为false
  }

  return { handleSubmit, error };
};

export default useSubmit;
