import { useEffect, useState } from 'react';
import { Locator } from '../System/Locator';
import { AIService } from '@src/ai/mgr/AIService';

export const WeakObjectEvent = {
  // 对象-》字段-》FunctionList
  weakObjectEventMap: new WeakMap<Object, Set<Function>>(),

  bind(obj: Object | undefined, callback: Function) {
    if (obj == undefined) {
      return;
    }
    if (!this.weakObjectEventMap.has(obj)) {
      this.weakObjectEventMap.set(obj, new Set<Function>());
    }
    const subscribers = this.weakObjectEventMap.get(obj);
    subscribers?.add(callback);
    return () => {
      subscribers?.delete(callback);
    };
  },

  unBind(obj: Object, callback: Function) {
    const subscribers = this.weakObjectEventMap.get(obj);
    subscribers?.delete(callback);
  },

  fire(obj: Object, ...args: any[]) {
    const subscribers = this.weakObjectEventMap.get(obj);
    subscribers?.forEach((callback) => {
      callback(...args);
    });
  },
};

export function useBindObjectEvent(obj: Object | undefined) {
  const [_, setSymbol] = useState<Symbol>();
  useEffect(() => {
    const callback = () => {
      setSymbol(Symbol());
    };
    const unBind = WeakObjectEvent.bind(obj, callback);
    return () => {
      unBind ? unBind() : undefined;
    };
  }, [obj]);
}
