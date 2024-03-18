import React, { useEffect } from 'react';
import useStore from '@store/store'; // 导入全局状态管理的自定义Hook
import i18n from './i18n'; // 导入国际化配置文件

import Chat from '@components/Chat'; // 导入聊天组件
import Menu from '@components/Menu'; // 导入菜单组件

import useInitialiseNewChat from '@hooks/useInitialiseNewChat'; // 导入初始化新聊天的自定义Hook
import { ChatInterface } from '@type/chat'; // 导入聊天接口类型
import { Theme } from '@type/theme'; // 导入主题类型
import ApiPopup from '@components/ApiPopup'; // 导入API弹窗组件
import Toast from '@components/Toast'; // 导入提示组件

function App() {
  const initialiseNewChat = useInitialiseNewChat(); // 使用初始化新聊天的自定义Hook
  const setChats = useStore((state) => state.setChats); // 获取设置聊天列表的函数
  const setTheme = useStore((state) => state.setTheme); // 获取设置主题的函数
  const setApiKey = useStore((state) => state.setApiKey); // 获取设置API密钥的函数
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex); // 获取设置当前聊天索引的函数

  useEffect(() => {
    // 设置文档的语言
    document.documentElement.lang = i18n.language;
    // 监听语言变化事件，更新文档的语言
    i18n.on('languageChanged', (lng) => {
      document.documentElement.lang = lng;
    });
  }, []);

  useEffect(() => {
    // 从旧版本本地存储中获取聊天列表、API密钥和主题等信息
    const oldChats = localStorage.getItem('chats');
    const apiKey = localStorage.getItem('apiKey');
    const theme = localStorage.getItem('theme');

    if (apiKey) {
      // 如果存在API密钥，更新全局状态中的API密钥并移除旧版本的本地存储中的API密钥
      setApiKey(apiKey);
      localStorage.removeItem('apiKey');
    }

    if (theme) {
      // 如果存在主题，更新全局状态中的主题并移除旧版本的本地存储中的主题
      setTheme(theme as Theme);
      localStorage.removeItem('theme');
    }

    if (oldChats) {
      // 如果存在旧版本的本地存储中的聊天列表数据
      try {
        // 解析聊天列表数据并更新全局状态中的聊天列表和当前聊天索引
        const chats: ChatInterface[] = JSON.parse(oldChats);
        if (chats.length > 0) {
          setChats(chats);
          setCurrentChatIndex(0);
        } else {
          initialiseNewChat();
        }
      } catch (e: unknown) {
        console.log(e);
        initialiseNewChat();
      }
      localStorage.removeItem('chats');
    } else {
      // 如果不存在旧版本的本地存储中的聊天列表数据
      const chats = useStore.getState().chats;
      const currentChatIndex = useStore.getState().currentChatIndex;
      if (!chats || chats.length === 0) {
        initialiseNewChat();
      }
      if (
        chats &&
        !(currentChatIndex >= 0 && currentChatIndex < chats.length)
      ) {
        setCurrentChatIndex(0);
      }
    }
  }, []);

  return (
    // 渲染Menu、Chat、ApiPopup和Toast组件
    <div className='overflow-hidden w-full h-full relative'>
      <Menu />
      <Chat />
      <ApiPopup />
      <Toast />
    </div>
  );
}

export default App;
