import { EventService } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';
import { AbstractModule } from '../System/AbstractModule';
import { DynamicComponentProps, DynamicComponentState } from '../Popup/PopupService';


export class ContextMenuService extends AbstractModule
{
  public showContextMenu(component:any, event:React.MouseEvent, props:DynamicComponentProps)
  {
    props = {
      data : props,
      pos: {
        x: event.clientX,
        y: event.clientY,
      },
    }
    const menu:DynamicComponentProps = {
      Component: component,
      props: props,
    }    
    EventService.dispatchEvent(EventEnum.SHOW_CONTEXT_MENU, menu)
  }


  public hideContextMenu()
  {
    EventService.dispatchEvent(EventEnum.SHOW_CONTEXT_MENU, undefined)
  }
}
