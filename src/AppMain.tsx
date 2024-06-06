import { AppStateEnum } from '@src/common/data/Modules';
import React, { useEffect } from 'react';
import PopupMain from '@src/common/Popup/PopupMain'; // 导入提示组件
import ContextMenuMain from './common/ContextMenu/ContextMenuMain';
import { useBindEvent } from './common/Event/EventService';
import { EventEnum } from './common/Event/EventEnum';

import UserLogin from './user/components/UserLogin';
import { isLogin } from './main';
import App from './App';
const AppMain = React.memo(() => {
  const [isLoginState, setIsLoginState] = React.useState(isLogin())
  useBindEvent(EventEnum.APP_STATE_CHANGE, (value: AppStateEnum) => {
    setIsLoginState(value == AppStateEnum.LOGIN)
  })
  return (
    <>
      {isLoginState ? <App /> : <UserLogin />}
      <PopupMain />
      <ContextMenuMain />

    </>
  );
})

export default AppMain;
