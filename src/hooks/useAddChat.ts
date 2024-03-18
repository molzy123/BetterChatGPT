// 导入React和自定义的hook
import React from 'react';
import useStore from '@store/store';
// 导入生成默认聊天和聊天接口
import { generateDefaultChat } from '@constants/chat';
import { ChatInterface } from '@type/chat';

// 自定义hook useAddChat
const useAddChat = () => {
  // 使用useStore获取setChats和setCurrentChatIndex方法
  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  // 定义添加聊天的方法addChat
  const addChat = (folder?:string) => {
    // 获取当前存储的聊天数据
    const chats = useStore.getState().chats;
    if (chats) {
      // 深拷贝聊天数据
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      let titleIndex = 1;
      let title = `New Chat ${titleIndex}`;

      // 生成唯一的聊天标题
      while (chats.some((chat) => chat.title === title)) {
        titleIndex += 1;
        title = `New Chat ${titleIndex}`;
      }

      // 在聊天数据的开头添加新的聊天
      updatedChats.unshift(generateDefaultChat(title, folder));
      // 更新聊天数据
      setChats(updatedChats);
      // 设置当前聊天索引为0
      setCurrentChatIndex(0);
    }
  };

  // 返回添加聊天的方法
  return addChat;
};

// 导出自定义hook
export default useAddChat;