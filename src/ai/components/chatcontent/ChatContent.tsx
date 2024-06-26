import React, { useEffect, useRef, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import useStore from '@store/store';
import ScrollToBottomButton from './ScrollToBottomButton';
import NewMessageButton from '../message/NewMessageButton';
import CrossIcon from '@icon/CrossIcon';
import DownloadChat from './DownloadChat';
import CloneChat from './CloneChat';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';
import Message from '../message/Message';
import { AiChat } from '@src/ai/data/AIChat';
import { useBindObjectEvent } from '@src/common/Event/WeakObjectEventService';
import { useBindEvent } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';

const ChatContent = ({currentChat} :{currentChat:AiChat}) => {
  useBindObjectEvent(currentChat)
  const inputRole = useStore((state) => state.inputRole);
  const messages= currentChat.messages
  const advancedMode = useStore((state) => state.advancedMode);
  const generating = useStore.getState().generating;
  const saveRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useBindEvent(EventEnum.ERROR, (error: string) => {
    setError(error);
    setShowError(true);
  })
  useEffect(() => {
    if (generating) {
      setError('');
    }
  }, [generating]);

  return (
    <>
    {<div className='flex-1 overflow-hidden'>
      <ScrollToBottom className='h-full dark:bg-gray-800' followButtonClassName='hidden'>
        <ScrollToBottomButton />
        <div className='flex flex-col items-center text-sm dark:bg-gray-800'>
          <div className='flex flex-col items-center text-sm dark:bg-gray-800 w-full' ref={saveRef}>
            {/* 加号按钮，新增消息记录 */}
            {!generating && advancedMode && messages.length === 0 && (
              <NewMessageButton messageIndex={-1} />
            )}
            {messages.map((message, index) => (
              (advancedMode || index !== 0 || message.role !== 'system') && (
                <React.Fragment key={index}>
                  <Message
                    message={message}
                    index = {index}
                  />
                  {!generating && advancedMode && <NewMessageButton messageIndex={index} />}
                </React.Fragment>
              )
            ))}
          </div>
          {/* 用户输入框 */}
          <Message message={new AiChatMessage(inputRole,"",currentChat, "")} index={-1} sticky />
          {showError && (
            <div className='relative py-2 px-3 w-3/5 mt-3 max-md:w-11/12 border rounded-md border-red-500 bg-red-500/10'>
              <div className='text-gray-600 dark:text-gray-100 text-sm whitespace-pre-wrap'>
                {error}
              </div>
              <div
                className='text-white absolute top-1 right-1 cursor-pointer'
                onClick={() => {
                  setShowError(false)
                }}
              >
                <CrossIcon />
              </div>
            </div>
          )}
          <div
            className={`mt-4 w-full m-auto  'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'`}>
            {useStore.getState().generating || (
              <div className='md:w-[calc(100%-50px)] flex gap-4 flex-wrap justify-center'>
                <DownloadChat saveRef={saveRef} />
                <CloneChat />
              </div>
            )}
          </div>
          <div className='w-full h-36'></div>
          
        </div>
      </ScrollToBottom>
    </div>
    }
    </>
  );
};

export default ChatContent;
