import { IModule } from '@src/common/data/Modules';
import { FunctionComponent } from 'react';
import { Locator } from '@src/common/data/Locator';
import { EventService } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';
import { AbstractModule } from '../data/AbstractModule';

export type DynamicComponentProps = any;

export interface DynamicComponentState {
  Component: FunctionComponent<DynamicComponentProps>;
  props: DynamicComponentProps | null;
}

export class PopupService {
  popupList: DynamicComponentState[] = [];
  popupSet: Set<FunctionComponent> = new Set();

  public showPopup(component: any, props?: DynamicComponentProps): number {
    console.log(component);

    props = props || {};
    const popup = { Component: component, props: props };
    this.popupList.push(popup);
    console.log('Dispatch');

    EventService.dispatchEvent(EventEnum.POPUP_CHANGE, this.popupList);
    return this.popupList.length;
  }

  public showPopupOnce(component: any, props?: DynamicComponentProps) {
    console.log('>>>>>showPOponce');
    if (this.popupSet.has(component)) {
      return;
    }
    console.log('<<<<');

    this.showPopup(component, props);
    this.popupSet.add(component);
  }

  public hidePopup(index?: number) {
    let component;
    if (index !== undefined) {
      const popup = this.popupList.splice(index, 1);
      if (popup.length > 0) {
        component = popup[0].Component;
        this.popupSet.delete(component);
      }
    } else {
      const popup = this.popupList.pop();
      if (popup != undefined) {
        component = popup.Component;
        this.popupSet.delete(component);
      }
    }
    EventService.dispatchEvent(EventEnum.POPUP_CHANGE, this.popupList);
  }
}
