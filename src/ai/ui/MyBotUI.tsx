import React, { useEffect, useRef, useState } from 'react';
import IAiBotCreateDef, { IAiBotDef } from '@src/ai/data/AIDef';
import useStore from '@store/store';
import ReactDOM from 'react-dom';
import { get } from '@src/common/utils/CommonRequest';
import { Locator } from '@src/common/System/Locator';
import { AIService } from '@src/ai/mgr/AIService';
import AiBotItemUI from '@src/ai/ui/AiBotItemUI';
import { EventService } from '@src/common/Event/EventService';
import { PopupService } from '@src/common/Popup/PopupService';
import CreateAiBotUI from './CreateAiBotUI';
import { AiBot } from '../data/AiBot';
import NewIcon from '@icon/NewIcon';

interface MyBotUIProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyBotUI = () => {

  const isLogin = false;
  const aiService = Locator.fetch(AIService)
  const bots = aiService.aiBotList
  // useEffect(() => {
  //
  // }, []);

  const handleClose = function() {
    // data.setIsModalOpen(false);
    Locator.fetch(PopupService).hidePopup()
  };

  return (<div
    className='fixed top-0 left-0 z-[999] w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center'>
    <div className='max-auto flex flex-col w-[700px] h-[70%] overflow-y-auto  bg-gray-800 border-2 border-gray-700 rounded-xl p-8'>
      <div className='relative h-10 flex justify-center items-center text-center'>
        <h2 className=' text-2xl text-gray-300 font-bold mb-4'>{isLogin ? 'login' : 'register'}</h2>
        <div className="absolute right-2 top-0">
        <a onClick={() =>{Locator.fetch(PopupService).showPopupOnce(CreateAiBotUI,{ aiBot:new AiBot()});}} >
            <NewIcon className="w-8 h-8 text-gray-100 hover:text-gray-300 cursor-pointer"/>
          </a>
        </div>
      </div>
      <div className='flex basis-auto gap-3 flex-wrap'>
        {bots.map((item, index) => (
          <AiBotItemUI key={index} aiBot={item}/>
        ))}
      </div>
    </div>
    <div className='bg-gray-800/90 absolute top-0 left-0 h-full w-full z-[-1]'
         onClick={handleClose}
    />
  </div>
  );
};


export default MyBotUI;

