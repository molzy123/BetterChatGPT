import React, { useState, useEffect } from 'react';
import { DynamicComponentState, PopupService } from '@src/common/Popup/PopupService';
import { Locator } from '@src/common/data/Locator';
import { EventService } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';

const PopupMain: React.FC = () => {
  const [popupList, setPopupList] = useState<DynamicComponentState[]>([]);

  useEffect(() => {
    const callback = (newPopupList: DynamicComponentState[]) => {
      console.log(newPopupList.length);
      // 确保这里传递的是一个新的数组，以触发状态更新
      setPopupList([...newPopupList]);
    };

    const eventService = EventService;
    eventService.registerEvent(EventEnum.POPUP_CHANGE, callback);

    return () => {
      eventService.unregisterEvent(EventEnum.POPUP_CHANGE, callback);
    };
  }, []);

  return (
    <div>
      {
        popupList.map((popup, index) => {
          const { Component, props } = popup;
          return Component ? <Component key={index} {...props} /> : "No component loaded";
        })
      }
    </div>
  );
};

export default PopupMain;
