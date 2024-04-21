import React, { useEffect, useRef, useState } from 'react';

import useInitialiseNewChat from '@hooks/useInitialiseNewChat';

import ChatIcon from '@icon/ChatIcon';
import CrossIcon from '@icon/CrossIcon';
import DeleteIcon from '@icon/DeleteIcon';
import EditIcon from '@icon/EditIcon';
import TickIcon from '@icon/TickIcon';
import useStore from '@store/store';
import { AiChat } from '@src/ai/data/AIChat';
import { Locator } from '@src/common/data/Locator';
import { AIService } from '@src/ai/mgr/AIService';
import { useBindEventRefresh } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';
import { useBindObjectEvent } from '@src/common/Event/WeakObjectEventService';
import { AiBot } from '@src/ai/data/AiBot';

const ChatHistoryClass = {
  normal:
    'flex py-2 px-2 items-center gap-3 relative rounded-md bg-gray-900 hover:bg-gray-850 break-all hover:pr-4 group transition-opacity',
  active:
    'flex py-2 px-2 items-center gap-3 relative rounded-md break-all pr-14 bg-gray-800 hover:bg-gray-800 group transition-opacity',
  normalGradient:
    'absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-gray-850',
  activeGradient:
    'absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-800',
};

const ChatHistory = React.memo(
  ({ currentAiBot, chat, chatIndex, active }: { currentAiBot:AiBot ;chat: AiChat; chatIndex: number; active:boolean }) => {
    const generating = useStore((state) => state.generating);

    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [_title, _setTitle] = useState<string>(chat.title);
    useBindObjectEvent(chat)
    const inputRef = useRef<HTMLInputElement>(null);

    const editTitle = () => {
      chat.title = _title;
      setIsEdit(false);
    };

    const deleteChat = () => {
      currentAiBot.deleteChat(chat);
      setIsDelete(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        editTitle();
      }
    };

    const handleTick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (isEdit) editTitle();
      else if (isDelete) deleteChat();
    };

    const handleCross = () => {
      setIsDelete(false);
      setIsEdit(false);
    };


    useEffect(() => {
      if (inputRef && inputRef.current) inputRef.current.focus();
    }, [isEdit]);

    return (
      <a
        className={`${
          active ? ChatHistoryClass.active : ChatHistoryClass.normal
        } ${
          generating
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer opacity-100'
        }`}
        onClick={() => {
          if (!generating)
          {
            currentAiBot.currentChat = chat;
          } 
        }}
      >
        <ChatIcon />
        <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative' title={chat.title}>
          {isEdit ? (
            <input
              type='text'
              className='focus:outline-blue-600 text-sm border-none bg-transparent p-0 m-0 w-full'
              value={_title}
              onChange={(e) => {
                _setTitle(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          ) : (
            _title
          )}

          {isEdit || (
            <div
              className={
                active
                  ? ChatHistoryClass.activeGradient
                  : ChatHistoryClass.normalGradient
              }
            />
          )}
        </div>
        {active && (
          <div className='absolute flex right-1 z-10 text-gray-300 visible'>
            {isDelete || isEdit ? (
              <>
                <button
                  className='p-1 hover:text-white'
                  onClick={handleTick}
                  aria-label='confirm'
                >
                  <TickIcon />
                </button>
                <button
                  className='p-1 hover:text-white'
                  onClick={handleCross}
                  aria-label='cancel'
                >
                  <CrossIcon />
                </button>
              </>
            ) : (
              <>
                <button
                  className='p-1 hover:text-white'
                  onClick={() => setIsEdit(true)}
                  aria-label='edit chat title'
                >
                  <EditIcon />
                </button>
                <button
                  className='p-1 hover:text-white'
                  onClick={() => setIsDelete(true)}
                  aria-label='delete chat'
                >
                  <DeleteIcon />
                </button>
              </>
            )}
          </div>
        )}
      </a>
    );
  }
);

export default ChatHistory;
