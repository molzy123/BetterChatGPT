import { moduleClasses } from '@src/common/data/Modules';
import React from 'react';
import PopupMain from '@src/common/Popup/PopupMain'; // 导入提示组件
import ContextMenuMain from './common/ContextMenu/ContextMenuMain';

const AppMain = React.memo(({ children }:{
  children: React.ReactElement
})=>{
  return (
    <>
      {children}
      <PopupMain/>
      <ContextMenuMain/>
    </>
  );
})

export default AppMain;
