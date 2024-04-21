import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TickIcon from '@icon/TickIcon';
import { Locator } from '@src/common/data/Locator';
import { AIService } from '@src/ai/mgr/AIService';

const CloneChat = React.memo(() => {
  const { t } = useTranslation();
  const [cloned, setCloned] = useState<boolean>(false);

  const cloneChat = () => {
      Locator.fetch(AIService).currentAiBot?.cloneCurrentChat()
      setCloned(true);
      window.setTimeout(() => {
        setCloned(false);
      }, 3000);
  };

  return (
    <button
      className='btn btn-neutral flex gap-1'
      aria-label={t('cloneChat') as string}
      onClick={cloneChat}
    >
      {cloned ? (
        <>
          <TickIcon /> {t('cloned')}
        </>
      ) : (
        <>{t('cloneChat')}</>
      )}
    </button>
  );
});

export default CloneChat;
