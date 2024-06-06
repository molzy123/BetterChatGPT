import NewChat from './NewChat';
import ChatHistoryList from './ChatHistoryList';
import MenuOptions from './MenuOptions';
import { Locator } from '@src/common/System/Locator';
import { AIService } from '@src/ai/mgr/AIService';
import { useBindEventRefresh } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';
const Menu = () => {
  const currentAiBot = Locator.fetch(AIService).currentAiBot
  useBindEventRefresh(EventEnum.CURRENT_BOT_CHANGED)
  return (
    <>
      <div
        id='menu'
        className={`group/menu dark bg-gray-900  md:inset-y-0 md:flex md:w-[260px] md:flex-col transition-transform z-[999] top-0 left-0 h-full max-md:w-3/4`}
      >
        <div className='flex h-full min-h-0 flex-col'>
          <div className='flex h-full w-full flex-1 items-start border-white/20'>
            <nav className='flex h-full flex-1 flex-col space-y-1 px-2 pt-2'>
              <div className='flex gap-2'>
                <NewChat />
              </div>
              {currentAiBot && <ChatHistoryList currentAiBot={currentAiBot} />}
              <MenuOptions />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
