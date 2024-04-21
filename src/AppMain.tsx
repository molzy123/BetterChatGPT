import { moduleClasses } from '@src/common/data/Modules';
import React from 'react';
import PopupMain from '@src/common/Popup/PopupMain'; // 导入提示组件

const AppMain = React.memo(({ children }:{
  children: React.ReactElement
})=>{
  return (
    <>
      {children}
      <PopupMain/>
    </>
  );
})

export default AppMain;
