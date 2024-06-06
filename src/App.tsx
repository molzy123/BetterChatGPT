import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store'; // 导入全局状态管理的自定义Hook
import i18n from './i18n'; // 导入国际化配置文件
import Menu from '@components/Menu'; // 导入菜单组件
import { ChatInterface } from '@type/chat'; // 导入聊天接口类型
import { Theme } from '@type/theme'; // 导入主题类型
import UserInfo from '@src/user/components/UserInfo';
import { Locator } from './common/System/Locator';
import { UserService } from './user/mgr/UserService';
import { EventEnum } from './common/Event/EventEnum';
import { useBindEventRefresh } from './common/Event/EventService';
import Chat from './ai/components/chat/Chat';
import { AIService } from './ai/mgr/AIService';
import EnglishWordMain from './english_word/EnglishWordMain';
import Header, { TabItemData } from './common/System/Header';

function App() {
  const setTheme = useStore((state) => state.setTheme); // 获取设置主题的函数


  const [curTab, setCurTab] = useState<TabItemData>();
  useBindEventRefresh(EventEnum.CURRENT_BOT_CHANGED)
  useBindEventRefresh(EventEnum.APP_STATE_CHANGE)
  const currentAiBot = Locator.fetch(AIService).currentAiBot

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      // 如果存在主题，更新全局状态中的主题并移除旧版本的本地存储中的主题
      setTheme(theme as Theme);
      localStorage.removeItem('theme');
    }
  }, []);
  return (
    <>
      <div className='flex flex-col h-screen'>
        <Header tabChange={setCurTab} />
        <main className='flex-grow bg-gray-100  overflow-auto'>
          {curTab?.index === 1 &&
            <div className='flex h-full'>
              <Menu />
              <div className='w-full bg-gray-100 overflow-auto'>
                {currentAiBot && <Chat currentAiBot={currentAiBot} />}
              </div>
            </div>}
          {curTab?.index === 2 && <UserInfo />}
          {curTab?.index === 3 && <EnglishWordMain />}
        </main>
      </div>
    </>
  );
}

export default App;
