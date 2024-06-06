import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';
await import('katex/dist/katex.min.css');

import './i18n';
import AppMain from '@src/AppMain';
import { Locator } from './common/data/Locator';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TextShowWin from './window/TextShowWin';
import { AppStateEnum, LoginState, LogoutState, StateMachine } from './common/data/Modules';
import { PopupService } from './common/Popup/PopupService';
import { UserService } from './user/mgr/UserService';
import UserLogin from './user/components/UserLogin';

const appMachine = new StateMachine();
appMachine.addState(new LoginState());
appMachine.addState(new LogoutState());
appMachine.changeState(AppStateEnum.LOGOUT);
Locator.register(PopupService, new PopupService());
Locator.register(UserService, new UserService());
export const changeState = appMachine.changeState.bind(appMachine);
export const isLogin = appMachine.isState.bind(appMachine, AppStateEnum.LOGIN);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <AppMain />
  // </React.StrictMode>
);
