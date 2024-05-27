import React, { useEffect, useRef, useState } from 'react';
import PopupModal from '@components/PopupModal';
import IAiBotCreateDef, { IAiBotDef } from '@src/ai/data/AIDef';

import { CommonTextInput } from '@src/common/components/CommonTextInput';
import { sum } from 'lodash';
import CommonSelector from '@src/common/components/CommonSelector';
import CommonSlider from '@src/common/components/CommonSlider';
import useStore from '@store/store';
import { Locator } from '@src/common/data/Locator';
import { AIService } from '@src/ai/mgr/AIService';
import { AiBot } from '@src/ai/data/AiBot';
import { PopupService } from '@src/common/Popup/PopupService';
import { WeakObjectEvent, useBindObjectEvent } from '@src/common/Event/WeakObjectEventService';

const CreateAiBotUI = ({aiBot} :{aiBot:AiBot}) => {
  console.log(aiBot);
  useBindObjectEvent(aiBot)
  const models = [{name:'gpt-3.5-turbo' },{name:"gpt-4"}]
  const aiService = Locator.fetch(AIService)
  const handleConfirm = async () => {
    aiService.createAiBot(aiBot.toJson())
    Locator.fetch(PopupService).hidePopup()
  };

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['基本设置', '参数设置', '高级设置'];

  return (
    <PopupModal
      title={"Create AI Bot"}
      setIsModalOpen={()=>{Locator.fetch(PopupService).hidePopup()}}
      handleConfirm={handleConfirm}
      handleClickBackdrop={handleConfirm}
    >
      <div className="flex flex-col w-full">
        <div className="mb-4 flex h-7 m-2 gap-5">
          {tabs.map((tab, index) => (
            <button key={index} className={`flex-grow ${activeTab === index ? 'border-b-2 border-gray-500 text-gray-100' : 'text-gray-500'}   items-center justify-center  flex gap-1`} onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-4">
          <div className='px-6 w-[500px] border-b border-gray-200 dark:border-gray-600'>
          {activeTab === 0 && (
            <div>
              <CommonTextInput hintText="name" onChange={(name)=>{
                console.log(name);
                
                aiBot.name = name;
                WeakObjectEvent.fire(aiBot);
              }} value={aiBot.name}></CommonTextInput>

              <CommonTextInput hintText="summary" onChange={(summary)=>{
                aiBot.description = summary;
                WeakObjectEvent.fire(aiBot);
              }} value={aiBot.description}></CommonTextInput>

              <CommonTextInput hintText="prompt" onChange={(prompt)=>{
                WeakObjectEvent.fire(aiBot);
              }} value={aiBot.description}></CommonTextInput>


            </div>
          )}
            {activeTab === 1 && (
              <div>
                <CommonSelector defaultIndex={models.findIndex((item,index)=>{
                  return item.name == aiBot.config.model;
                })} items={models} selectChange={(item)=>{
                  aiBot.config.model = item.name;
                  WeakObjectEvent.fire(aiBot);
                }}/>

                <CommonSlider value={aiBot.config.top_p} onChange={(value)=>{
                  aiBot.config.top_p = value;
                  WeakObjectEvent.fire(aiBot);
                }} min={0} max={1} step={0.05} label={"top_p"} />
                <CommonSlider value={aiBot.config.presence_penalty} onChange={(value)=>{
                  aiBot.config.presence_penalty = value;
                  WeakObjectEvent.fire(aiBot);
                }} min={-2} max={2} step={0.1} label={"PresencePenalty"} />
                <CommonSlider value={aiBot.config.frequency_penalty} onChange={(value)=>{
                  aiBot.config.frequency_penalty = value;
                  WeakObjectEvent.fire(aiBot);
                }} min={-2} max={2} step={0.1} label={"FrequencyPenalty"} />
                <CommonSlider value={aiBot.config.n} onChange={(value)=>{
                  aiBot.config.n = value;
                  WeakObjectEvent.fire(aiBot);
                }} min={1} max={32} step={1} label={"n"} />
              </div>
            )}
            {activeTab === 2 && (
              <div>

              </div>
            )}
        </div>
        </div>
      </div>

    </PopupModal>
  );
};


export default CreateAiBotUI;
