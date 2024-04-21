import React from 'react';
import useStore from '@store/store';

import Avatar from './Avatar';
import MessageContent from './MessageContent';

import { Role } from '@type/chat';
import RoleSelector from './RoleSelector';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';
import { useBindObjectEvent } from '@src/common/Event/WeakObjectEventService';

// const backgroundStyle: { [role in Role]: string } = {
//   user: 'dark:bg-gray-800',
//   assistant: 'bg-gray-50 dark:bg-gray-650',
//   system: 'bg-gray-50 dark:bg-gray-650',
// };
const backgroundStyle = ['dark:bg-gray-800', 'bg-gray-50 dark:bg-gray-650'];

const Message = React.memo(
  ({ message, sticky = false, index }: { message:AiChatMessage; sticky?: boolean;index:number }) => {
    const hideSideMenu = useStore((state) => state.hideSideMenu);
    const advancedMode = useStore((state) => state.advancedMode);
    useBindObjectEvent(message)
    
    return (
      <div className={`w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group ${backgroundStyle[index % 2]}`}>
        <div
          className={`text-base gap-4 md:gap-6 m-auto p-4 md:py-6 flex transition-all ease-in-out ${
            hideSideMenu
              ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl'
              : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'
          }`}
        >
          <Avatar role={message.role} />
          <div className='w-[calc(100%-50px)] '>
            {advancedMode &&
              <RoleSelector
                message = {message}
                sticky={sticky}
              />}
            <MessageContent
              message={message}
              sticky={sticky} 
              index={index}            
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Message;
