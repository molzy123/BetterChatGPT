import React, { useEffect, useRef, useState } from 'react';
import { IAiBotDef } from '@src/ai/data/AIDef';
import useStore from '@store/store';
import { get } from '@src/common/utils/CommonRequest';
import { AiBot } from '@src/ai/data/AiBot';
import { Locator } from '@src/common/data/Locator';
import { AIService } from '@src/ai/mgr/AIService';
import { EventService } from '@src/common/Event/EventService';
import { PopupService } from '@src/common/Popup/PopupService';
import MyBotUI from '@src/ai/ui/MyBotUI';
import StarIcon from '@icon/StarIcon';
import EditIcon from '@icon/EditIcon';

interface AiBotItemUIProps {
  aiBot: AiBot;
}

const AiBotItemUI = (data: AiBotItemUIProps) => {

  const aiService = Locator.fetch(AIService)
  const handleClick = async function() {
    aiService.currentAiBot = data.aiBot;
    Locator.fetch(PopupService).hidePopup()
  }
  const editBot = function(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.stopPropagation()
  }

  return (
    <div className=' w-[200px] rounded-md bg-gray-700 h-[100px] p-1 cursor-pointer hover:bg-gray-650 ' onClick={handleClick}>
      <div className='flex flex-col w-full h-full px-1 group'>
        <div className='text-gray-200 text-md text-center'>
          <div>
            {data.aiBot.name}
            
          </div>
        </div>
        <div className='text-gray-200 text-sm flex-grow'>{data.aiBot.description}</div>
        <div className='h-5'>
          <button onClick={editBot} className="group-hover:opacity-100 opacity-0">
             <EditIcon className="text-gray-100"></EditIcon>
          </button>
         
        </div>
      </div>
    </div>
  );
};


export default AiBotItemUI;