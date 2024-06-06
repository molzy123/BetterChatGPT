import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
await import('katex/dist/katex.min.css');

import './i18n';
import AppMain from '@src/AppMain';
import { StateMachine } from './common/System/StateMachine';
import { PlayState } from './common/System/PlayStae';
import { LoginState } from './common/System/LoginState';
import { AppStateEnum } from './common/System/AppStateEnum';

const appMachine = new StateMachine();
appMachine.addState(new PlayState());
appMachine.addState(new LoginState());
export const changeState = appMachine.changeState.bind(appMachine);
export const isLogin = appMachine.isState.bind(appMachine, AppStateEnum.PLAY);
changeState(AppStateEnum.LOGIN);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <AppMain />
  </React.StrictMode>
);
