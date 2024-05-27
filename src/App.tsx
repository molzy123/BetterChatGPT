import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store'; // 导入全局状态管理的自定义Hook
import i18n from './i18n'; // 导入国际化配置文件
import Menu from '@components/Menu'; // 导入菜单组件
import { ChatInterface } from '@type/chat'; // 导入聊天接口类型
import { Theme } from '@type/theme'; // 导入主题类型
import UserInfo from '@src/user/components/UserInfo';
import { Locator } from './common/data/Locator';
import { UserService, UserStateEnum } from './user/mgr/UserService';
import { EventEnum } from './common/Event/EventEnum';
import { useBindEvent, useBindEventRefresh } from './common/Event/EventService';
import { PopupService } from './common/Popup/PopupService';
import UserLogin from './user/components/UserLogin';
import Chat from './ai/components/chat/Chat';
import { AIService } from './ai/mgr/AIService';
import EnglishWordMain from './english_word/EnglishWordMain';
function App() {
  const setTheme = useStore((state) => state.setTheme); // 获取设置主题的函数
  const tabs = ['Tab1', 'Tab2', 'Tab3'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const userToken = useRef<String>();
  const userService = Locator.fetch(UserService)
  useBindEvent(EventEnum.LOGIN_STATE_CHANGE,(value:UserStateEnum)=>{
    if(value == UserStateEnum.LOGOUT){
      Locator.fetch(PopupService).showPopupOnce(UserLogin)
    }else if(value == UserStateEnum.LOGIN){
      Locator.fetch(PopupService).hidePopup()
    }
    userToken.current = userService.accessToken;
  })

  useEffect(() => {
    userToken.current = userService.accessToken;
  })
  useBindEventRefresh(EventEnum.CURRENT_BOT_CHANGED)
  const currentAiBot = Locator.fetch(AIService).currentAiBot

  const handleTabClick = ({ tab }: { tab: any }) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    // 设置文档的语言
    document.documentElement.lang = i18n.language;
    // 监听语言变化事件，更新文档的语言
    i18n.on('languageChanged', (lng) => {
      document.documentElement.lang = lng;
    });
  }, []);
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      // 如果存在主题，更新全局状态中的主题并移除旧版本的本地存储中的主题
      setTheme(theme as Theme);
      localStorage.removeItem('theme');
    }
  }, []);
  return (
    <div className='flex flex-col h-screen'>
      <header className='flex items-center justify-between w-full p-4 bg-blue-500 text-white'>
        <nav className='flex space-x-4'>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-3 py-2 font-semibold rounded-md ${
                activeTab === tab ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={() => handleTabClick({ tab: tab })}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className='flex items-center space-x-2 cursor-pointer' onClick={()=>{
          if(userService.state == UserStateEnum.LOGOUT)
            {
              Locator.fetch(PopupService).showPopupOnce(UserLogin)
            }else
            {
              console.log("token:",userToken)
            }
        }}>
          <img className='w-8 h-8 rounded-full' src='https://images.unsplash.com/photo-1470429346530-f5590bff80d2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=7200' alt='User avatar' />
          <span>linzy</span>
        </div>
      </header>
      <main className='flex-grow bg-gray-100  overflow-auto'>
        {activeTab === 'Tab1' &&
          <div className='flex h-full'>
            <Menu />
            <div className='w-full bg-gray-100 overflow-auto'>
              { currentAiBot && <Chat currentAiBot={currentAiBot} />}
            </div>
          </div>}
        {activeTab === 'Tab2' && <UserInfo/>  }
        {activeTab === 'Tab3' && <EnglishWordMain/> }
      </main>
    </div>
  );
}

export default App;
