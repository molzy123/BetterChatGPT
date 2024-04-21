import React, { useState } from 'react';
import useStore from '@store/store';

import ContentView from './view/ContentView';
import EditView from './view/EditView';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';

const MessageContent = ({
  message,
  index,
  sticky = false,
}: {
  index:number;
  message:AiChatMessage;
  sticky?: boolean;
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(sticky);
  const advancedMode = useStore((state) => state.advancedMode);
  
  return (
    <div className='relative flex flex-col gap-2 md:gap-3 lg:w-[calc(100%-115px)]'>
      {advancedMode && <div className='flex flex-grow flex-col gap-3'></div>}
      {isEdit ? (
        <EditView
          message={message}
          setIsEdit={setIsEdit}
          sticky={sticky}
        />
      ) : (
        <ContentView
          message={message}
          index = {index}
          setIsEdit={setIsEdit}
        />
      )}
    </div>
  );
};

export default MessageContent;
