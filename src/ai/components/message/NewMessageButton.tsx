import React from 'react';
import PlusIcon from '@icon/PlusIcon';
import { Locator } from '@src/common/data/Locator';
import { AIService } from '@src/ai/mgr/AIService';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';

const NewMessageButton = React.memo(
  ({ messageIndex }: { messageIndex: number }) => {
    const aiService = Locator.fetch(AIService);
    const addMessage = () => {
      aiService.currentAiBot?.currentChat?.addMessage(new AiChatMessage("user", ""),messageIndex+1);
    };
    return (
      <div
        className='h-0 w-0 relative'
        key={messageIndex}
        aria-label='insert message'
      >
        <div
          className='absolute top-0 right-0 translate-x-1/2 translate-y-[-50%] text-gray-600 dark:text-white cursor-pointer bg-gray-200 dark:bg-gray-600/80 rounded-full p-1 text-sm hover:bg-gray-300 dark:hover:bg-gray-800/80 transition-bg duration-200'
          onClick={addMessage}
        >
          <PlusIcon />
        </div>
      </div>
    );
  }
);

export default NewMessageButton;
