import { AIService } from '@src/ai/mgr/AIService';
import { UserService } from '@src/user/mgr/UserService';
import { PopupService } from '@src/common/Popup/PopupService';
import { ContextMenuService } from '../ContextMenu/ContextMenuService';
import { EnglishWordService } from '@src/english_word/mgr/EnglishWordService';

export interface IModule{
  initialize():void
  start():void
  destroy():void
}


export const moduleClasses:{ new():IModule }[] = [
  PopupService,
  AIService,
  UserService,
  ContextMenuService,
  EnglishWordService
]


