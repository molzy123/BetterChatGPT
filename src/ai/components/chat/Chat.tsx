

import StopGeneratingButton from '@components/StopGeneratingButton/StopGeneratingButton';
import ChatContent from '../chatcontent/ChatContent';
import { Locator } from '@src/common/data/Locator';
import { AIService } from '@src/ai/mgr/AIService';
import { useBindEventRefresh } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';
import { useBindObjectEvent } from '@src/common/Event/WeakObjectEventService';
import { AiBot } from '@src/ai/data/AiBot';

const Chat = ({ currentAiBot }: { currentAiBot: AiBot }) => {
  const currentChat = Locator.fetch(AIService).currentAiBot?.currentChat;
  useBindObjectEvent(currentAiBot)
  return (
    <div className={`flex h-full flex-1 flex-col 'md:pl-0'`}>
      <main className='relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1'>
        {currentChat && <ChatContent currentChat={currentChat} />}
        <StopGeneratingButton />
      </main>
    </div>
  );
};

export default Chat;
