import React, { useEffect, useMemo, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';

import countTokens from '@utils/messageUtils';
import { modelCost } from '@constants/chat';
import { Locator } from '@src/common/System/Locator';
import { AIService } from '@src/ai/mgr/AIService';

const TokenCount = React.memo(() => {
  const [tokenCount, setTokenCount] = useState<number>(0);
  const generating = useStore((state) => state.generating);

  const currentChat = Locator.fetch(AIService).currentAiBot?.currentChat;
  if (!currentChat) return null;
  const messages = currentChat.messages;

  const model = currentChat.bot.config.model;

  const cost = useMemo(() => {
    const price =
      modelCost[model].prompt.price *
      (tokenCount / modelCost[model].prompt.unit);
    return price.toPrecision(3);
  }, [model, tokenCount]);

  useEffect(() => {
    if (!generating) setTokenCount(countTokens(messages, model));
  }, [messages, generating]);

  return (
    <div className='absolute top-[-16px] right-0'>
      <div className='text-xs italic text-gray-900 dark:text-gray-300'>
        Tokens: {tokenCount} (${cost})
      </div>
    </div>
  );
});

export default TokenCount;
