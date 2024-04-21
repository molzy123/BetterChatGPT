import { EventEnum } from "../Event/EventEnum";
import { EventService } from "../Event/EventService";
import { Locator } from "./Locator";
import { IModule } from "./Modules";

export abstract class AbstractModule implements IModule{

    private _eventCbList = new Set<Function>();

    initialize(): void {
        
    }
    start(): void {

    }

    destroy(): void {
        this._eventCbList.forEach((cb)=>{
            cb()
        });
    }

    protected onEvent(event: EventEnum, callback: Function): void {
        const cb = EventService.registerEvent(event, callback)
        if(cb != undefined)
        {
            this._eventCbList.add(cb);
        }
    }


}