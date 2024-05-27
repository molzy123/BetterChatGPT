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

interface AiBotItemUIProps {
  aiBot: AiBot;
}

const AiBotItemUI = (data: AiBotItemUIProps) => {

  const aiService = Locator.fetch(AIService)
  const handleClick = async function() {
    aiService.currentAiBot = data.aiBot;
    Locator.fetch(PopupService).hidePopup()
  }

  return (
    <div className=' w-[200px]  bg-gray-200 h-[100px] ' onClick={handleClick}>
      <div className='flex flex-col'>
        <div className='text-gray-700'>{data.aiBot.name}</div>
        <div className='text-gray-700'>{data.aiBot.description}</div>
      </div>
    </div>
  );
};


export default AiBotItemUI;