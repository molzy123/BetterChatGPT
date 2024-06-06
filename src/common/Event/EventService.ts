import { EventEnum } from '@src/common/Event/EventEnum';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export const EventService = {
  eventMap: new Map<string, Function[]>(),

  registerEvent(eventName: string, callback: Function): () => void {
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, []);
    }

    this.eventMap.get(eventName)?.push(callback);
    return () => {
      this.unregisterEvent(eventName, callback);
    };
  },

  unregisterEvent(eventName: string, callback: Function): void {
    if (!this.eventMap.has(eventName)) {
      return;
    }

    const callbacks = this.eventMap.get(eventName);
    const index = callbacks?.indexOf(callback);
    if (index !== undefined && index !== -1) {
      callbacks?.splice(index, 1);
    }
  },

  dispatchEvent(eventName: string, ...args: any[]): void {
    console.log('>>>>>>>>dispatchEvent', eventName, args);

    if (!this.eventMap.has(eventName)) {
      return;
    }

    console.log('>>>>>>>>foreach');

    const callbacks = this.eventMap.get(eventName);
    console.log('<<<<<<<callbacks', callbacks);

    callbacks?.forEach((callback) => {
      console.log('>>>>zghxing ');

      callback(...args);
    });
  },
};

export function useBindEvent(event: EventEnum, cb: Function) {
  useEffect(() => {
    const unBind = EventService.registerEvent(event, cb);
    return () => {
      unBind();
    };
  });
}

export function useBindEventRefresh(event: EventEnum) {
  const [_, setSymbol] = useState<Symbol>();
  useEffect(() => {
    const callback = () => {
      setSymbol(Symbol());
    };
    const unBind = EventService.registerEvent(event, callback);
    return () => {
      unBind ? unBind() : undefined;
    };
  }, []);
}

const { ipcRenderer } = window.require('electron');
ipcRenderer.on('AI', (event, data) => {
  console.log('EventService', data);
});
