import { moduleClasses } from '@src/common/data/Modules';
import React, { useEffect } from 'react';
import PopupMain from '@src/common/Popup/PopupMain'; // 导入提示组件
import ContextMenuMain from './common/ContextMenu/ContextMenuMain';
import { useNavigate } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');
const AppMain = React.memo(({ children }:{
  children: React.ReactElement
})=>{
  useEffect(()=>{
    ipcRenderer.on("AI", (event, data) => {
      const params = { id: 123, message: data };
      console.log(">>>>>>>>>>>>>navigate>>>>>>>>>>>>>>",params);
    });
    return () => {
      ipcRenderer.removeAllListeners("AI");
    }
  },[])
  
  return (
    <>
      {children}
      <PopupMain/>
      <ContextMenuMain/>
    </>
  );
})

export default AppMain;
