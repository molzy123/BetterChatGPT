import { EventEnum } from "../Event/EventEnum";
import { EventService } from "../Event/EventService";
import { IModule, ISystemModule } from "./IModule";

export abstract class AbstractModule implements IModule{

    private _eventCbList = new Set<Function>();

    initialize(loginData:any): void {
        
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

export abstract class AbstractSystemModule extends AbstractModule implements ISystemModule{
    initialize(): void {
        
    }
}