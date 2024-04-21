import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';

import useAddChat from '@hooks/useAddChat';
import CreateAiBotUI from '@src/ai/ui/CreateAiBotUI';
import MyBotUI from '@src/ai/ui/MyBotUI';
import { Locator } from '@src/common/data/Locator';
import { PopupService } from '@src/common/Popup/PopupService';
import { AIService } from '@src/ai/mgr/AIService';

const NewChat = ({ folder }: { folder?: string }) =>
{
  const { t } = useTranslation();
  const addChat = function()
  {
    Locator.fetch(AIService).currentAiBot?.newChat()
  }
  const generating = useStore((state) => state.generating);
  const [newBot, setNewBot] = React.useState(false);
  return (
    <div className={'flex flex-1'}>
      <a
        className={`flex flex-1 items-center rounded-md hover:bg-gray-500/10 transition-all duration-200 text-white text-sm flex-shrink-0 ${
          generating
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer opacity-100'
        } ${
          folder ? 'justify-start' : 'py-2 px-2 gap-3 mb-2 border border-white/20'
        }`}
        onClick={() =>
        {
          if (!generating) addChat();
        }}
        title={folder ? String(t('newChat')) : ''}
      >
        {folder ? (
          <div
            className='max-h-0 parent-sibling-hover:max-h-10 hover:max-h-10 parent-sibling-hover:py-2 hover:py-2 px-2 overflow-hidden transition-all duration-200 delay-500 text-sm flex gap-3 items-center text-gray-100'>
            <PlusIcon /> {t('newChat')}
          </div>
        ) : (
          <>
            <PlusIcon />
            <span className='inline-flex text-white text-sm'>{t('newChat')}</span>
          </>
        )}
      </a>
      <a onClick={() =>
      {
        Locator.fetch(PopupService).showPopup(MyBotUI)
      }} className={'cursor-pointer opacity-100 border border-white/20 rounded-md mx-1 items-center text-gray-100'}>
        Bot List
      </a>

      <a onClick={() =>
      {
        setNewBot(true);
      }} className={'cursor-pointer opacity-100 border border-white/20 rounded-md mx-1 items-center text-gray-100'}>
        New Bot
      </a>
      {newBot && <CreateAiBotUI setIsModalOpen={setNewBot} />}
    </div>

  );
};

export default NewChat;
