import React from 'react';
import useStore from '@store/store'; // 导入自定义Hook：使用store状态管理
import { useTranslation } from 'react-i18next'; // 导入第三方库：用于多语言翻译
import { ChatInterface, MessageInterface } from '@type/chat'; // 导入自定义类型
import { getChatCompletion, getChatCompletionStream } from '@api/api'; // 导入API请求方法
import { parseEventSource } from '@api/helper'; // 导入辅助函数：解析SSE事件源
import { limitMessageTokens, updateTotalTokenUsed } from '@utils/messageUtils'; // 导入辅助函数
import { _defaultChatConfig } from '@constants/chat'; // 导入默认聊天配置常量
import { officialAPIEndpoint } from '@constants/auth';
import { errorType, getClientError, handleErrorStatus } from '@utils/api';
import message from '@components/Chat/ChatContent/Message'; // 导入官方API端点常量

// 自定义Hook：使用提交功能
const useSubmit = () => {
  const { t, i18n } = useTranslation('api'); // 初始化国际化翻译
  const error = useStore((state) => state.error); // 获取error状态
  const apiEndpoint = "http://127.0.0.1:8000/AIChat/"
  const apiKey = useStore((state) => state.userToken);
  const setGenerating = useStore((state) => state.setGenerating); // 获取并更新setGenerating状态
  const generating = useStore((state) => state.generating); // 获取generating状态
  const currentChatIndex = useStore((state) => state.currentChatIndex); // 获取currentChatIndex状态
  const setChats = useStore((state) => state.setChats); // 获取并更新setChats状态

  // 生成标题方法
  const generateTitle = async (message: MessageInterface[]): Promise<string> => {
    let data;
    try {
      if (apiKey) {
        // 使用自定义ApiKey
        data = await getChatCompletion(
          apiEndpoint,
          message,
          _defaultChatConfig,
          apiKey,
        );
      }
    } catch (error) {
      handleErrorStatus(error);
    }
    return data.choices[0].message.content; // 返回生成的标题内容
  };

  // 提交表单方法
  const handleSubmit = async () => {
    const chats = useStore.getState().chats; // 获取当前聊天列表
    if (generating || !chats) return;

    const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats)); // 深拷贝聊天列表

    // 添加一个空白助手消息到当前聊天索引的消息列表中
    updatedChats[currentChatIndex].messages.push({
      role: 'assistant',
      content: '',
    });

    setChats(updatedChats); // 更新聊天列表
    setGenerating(true); // 设置生成中状态为true

    try {
      let stream;
      if (chats[currentChatIndex].messages.length === 0){
        throw new Error(getClientError("No messages submitted!")); // 如果没有消息被提交，则抛出错误：未提交消息
      }


      const messages = limitMessageTokens(
        chats[currentChatIndex].messages,
        chats[currentChatIndex].config.max_tokens,
        chats[currentChatIndex].config.model,
      ); // 限制消息的token数量

      if (messages.length === 0){
        throw new Error(getClientError('Message exceed max token!')); // 如果没有消息被提交，则抛出错误：未提交消息
      }

      if (apiKey) {
        // 使用自定义ApiKey
        stream = await getChatCompletionStream(
          apiEndpoint,
          messages,
          chats[currentChatIndex].config,
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
          const result = parseEventSource(
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

            const updatedChats: ChatInterface[] = JSON.parse(
              JSON.stringify(useStore.getState().chats),
            );

            const updatedMessages = updatedChats[currentChatIndex].messages;
            updatedMessages[updatedMessages.length - 1].content += resultString; // 更新最后一条助手消息的内容
            setChats(updatedChats); // 更新聊天列表
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
      const currChats = useStore.getState().chats;
      const countTotalTokens = useStore.getState().countTotalTokens;

      if (currChats && countTotalTokens) {
        const model = currChats[currentChatIndex].config.model;
        const messages = currChats[currentChatIndex].messages;
        updateTotalTokenUsed(
          model,
          messages.slice(0, -1),
          messages[messages.length - 1],
        );
      }

      // 为新的聊天生成标题
      if (useStore.getState().autoTitle && currChats && !currChats[currentChatIndex]?.titleSet)
      {
        const messages_length = currChats[currentChatIndex].messages.length;
        const assistant_message =
          currChats[currentChatIndex].messages[messages_length - 1].content;
        const user_message =
          currChats[currentChatIndex].messages[messages_length - 2].content;

        const message: MessageInterface = {
          role: 'user',
          content: `Generate a title in less than 6 words for the following message (language: ${i18n.language}):\n"""\nUser: ${user_message}\nAssistant: ${assistant_message}\n"""`,
        };

        let title = (await generateTitle([message])).trim();
        if (title.startsWith('"') && title.endsWith('"')) {
          title = title.slice(1, -1);
        }
        const updatedChats: ChatInterface[] = JSON.parse(
          JSON.stringify(useStore.getState().chats),
        );
        updatedChats[currentChatIndex].title = title;
        updatedChats[currentChatIndex].titleSet = true;
        setChats(updatedChats);

        // 更新生成标题时使用的token数量
        if (countTotalTokens) {
          const model = _defaultChatConfig.model;
          updateTotalTokenUsed(model, [message], {
            role: 'assistant',
            content: title,
          });
        }
      }
    } catch (e) {
      handleErrorStatus(e)
    }

    setGenerating(false); // 设置生成中状态为false
  };

  return { handleSubmit, error };
};

export default useSubmit;
