import React, { useEffect, useRef, useState } from 'react';
import PopupModal from '@components/PopupModal';
import AiBotCreateBean from '@src/ai/data/RequstBeam';
import BeanFactory from '@src/ai/Util/BeanFactory';
import { CommonTextInput } from '@src/common/components/CommonTextInput';
import { sum } from 'lodash';
import CommonSelector from '@src/common/components/CommonSelector';
import CommonSlider from '@src/common/components/CommonSlider';
import { createAiBot } from '@src/ai/AiRequest';
import useStore from '@store/store';

interface CreateAiBotUIProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateAiBotUI = (data:CreateAiBotUIProps) => {
  const aiBotCreate = useRef(BeanFactory.getDefaultAiBotBeanFactory());
  const [_name, _setName] = useState<string>(aiBotCreate.current.name);
  const [_summary, _setSummary] = useState<string>(aiBotCreate.current.summary);
  const [_model, _setModel] = useState<string>(aiBotCreate.current.config.model);
  const [_topP, _setTopP] = useState<number>(aiBotCreate.current.config.top_p);
  const [_frequencyPenalty, _setFrequencyPenalty] = useState<number>(aiBotCreate.current.config.frequency_penalty);
  const [_presencePenalty,_setPresencePenalty ] = useState<number>(aiBotCreate.current.config.presence_penalty);
  const [_n, _setN] = useState<number>(aiBotCreate.current.config.n);
  const models = [{name:'gpt-3.5' },{name:"gpt-4"}]
  const accessToken =  useStore((state) => state.userToken);
  const handleConfirm = async () => {
    const response = await createAiBot(aiBotCreate.current)
    console.log(response);
  };

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['基本设置', '参数设置', '高级设置'];

  return (
    <PopupModal
      title={"Create AI Bot"}
      setIsModalOpen={data.setIsModalOpen}
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
                _setName(name);
                aiBotCreate.current.name = name;
              }} value={_name}></CommonTextInput>

              <CommonTextInput hintText="summary" onChange={(summary)=>{
                _setSummary(summary);
                aiBotCreate.current.summary = summary;
              }} value={_summary}></CommonTextInput>


            </div>
          )}
            {activeTab === 1 && (
              <div>
                <CommonSelector defaultIndex={models.findIndex((item,index)=>{
                  return item.name == aiBotCreate.current.config.model;
                })} items={models} selectChange={(item)=>{
                  _setModel(item.name);
                  aiBotCreate.current.config.model = item.name;
                }}/>

                <CommonSlider value={_topP} onChange={(value)=>{
                  aiBotCreate.current.config.top_p = value;
                  _setTopP(value);
                }} min={0} max={1} step={0.05} label={"top_p"} />
                <CommonSlider value={_presencePenalty} onChange={(value)=>{
                  aiBotCreate.current.config.presence_penalty = value;
                  _setPresencePenalty(value);
                }} min={-2} max={2} step={0.1} label={"PresencePenalty"} />
                <CommonSlider value={_frequencyPenalty} onChange={(value)=>{
                  aiBotCreate.current.config.frequency_penalty = value;
                  _setFrequencyPenalty(value);
                }} min={-2} max={2} step={0.1} label={"FrequencyPenalty"} />
                <CommonSlider value={_n} onChange={(value)=>{
                  aiBotCreate.current.config.n = value;
                  _setN(value);
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
