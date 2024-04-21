import React, { useEffect, useRef, useState } from 'react';
import ChatHistory from './ChatHistory';
import ChatSearch from './ChatSearch';
import { AiChat } from '@src/ai/data/AIChat';
import { useBindObjectEvent } from '@src/common/Event/WeakObjectEventService';
import { AiBot } from '@src/ai/data/AiBot';

const ChatHistoryList = ({currentAiBot}:{currentAiBot:AiBot}) => {
  const [filter, setFilter] = useState<string>('');
  const filterRef = useRef<string>(filter);
  useBindObjectEvent(currentAiBot)
  let currentBotChatList:AiChat[] = [];
  
  if(currentAiBot.chatList != undefined)
  {
    currentBotChatList = currentAiBot.chatList
  }
  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  return (
    <div
      className={`flex-col flex-1 overflow-y-auto hide-scroll-bar border-b border-white/20 `}>
      <ChatSearch filter={filter} setFilter={setFilter} />
      {currentAiBot && 
        <div className='flex flex-col gap-2 text-gray-100 text-sm'>
          {currentBotChatList.map((chat, index) => (
            <ChatHistory currentAiBot={currentAiBot} chat={chat} active={chat == currentAiBot.currentChat} key={index} chatIndex={index} />
          ))}
        </div>
      }
      <div className='w-full h-10' />
    </div>
  );
};

const ShowMoreButton = () => {
  return (
    <button className='btn relative btn-dark btn-small m-auto mb-2'>
      <div className='flex items-center justify-center gap-2'>Show more</div>
    </button>
  );
};

export default ChatHistoryList;
