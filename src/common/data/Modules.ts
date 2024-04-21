import { AIService } from '@src/ai/mgr/AIService';
import { UserService } from '@src/user/mgr/UserService';
import { PopupService } from '@src/common/Popup/PopupService';

export interface IModule{
  initialize():void
  start():void
  destroy():void
}


export const moduleClasses:{ new():IModule }[] = [
  PopupService,
  AIService,
  UserService,
]


