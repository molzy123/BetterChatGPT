import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';
await import('katex/dist/katex.min.css');

import './i18n';
import AppMain from '@src/AppMain';
import { moduleClasses } from './common/data/Modules';
import { Locator } from './common/data/Locator';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TextShowWin from './window/TextShowWin';

moduleClasses.forEach((moduleClass) => {
  const module = new moduleClass();
  Locator.register(moduleClass, module)
})
moduleClasses.forEach((moduleClass) => {
  const module = Locator.fetch(moduleClass);
  module.initialize();
})
moduleClasses.forEach((moduleClass) => {
  const module = Locator.fetch(moduleClass);
  module.start();
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <AppMain>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/alert" element={<TextShowWin/>}/>
        </Routes>
      </BrowserRouter>
    </AppMain>
  // </React.StrictMode>
);
