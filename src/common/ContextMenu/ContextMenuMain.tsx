import React, { useState, useEffect } from 'react';
import { DynamicComponentState, PopupService } from '@src/common/Popup/PopupService';
import { Locator } from '@src/common/data/Locator';
import { EventService } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';

const ContextMenuMain: React.FC = () => {
  const [menu, setMenu] = useState<DynamicComponentState>();

  
  
  const Component = menu?.Component;
  useEffect(() => {
    const callback = (data: DynamicComponentState) => {
      // 确保这里传递的是一个新的数组，以触发状态更新
      setMenu(data);
    };

    const eventService = EventService;
    eventService.registerEvent(EventEnum.SHOW_CONTEXT_MENU, callback);
    
    return () => {
      eventService.unregisterEvent(EventEnum.POPUP_CHANGE, callback);
    };
  }, []);

  return ( <div>{
    menu && Component &&
        <div className='fixed top-0 left-0 z-[999] w-full overflow-x-hidden overflow-y-auto h-full flex justify-center items-center'>
                {<Component {...menu?.props} /> }
            <div className='absolute top-0 left-0 h-full w-full z-[-1]'
                onClick={setMenu.bind(null, undefined)}
            />
        </div>
    }
        
  </div> 
    
  );
};

export default ContextMenuMain;
