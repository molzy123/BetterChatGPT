
import { EventEnum } from "../Event/EventEnum";
import { EventService } from "../Event/EventService";
import { AppState } from "./AppState";
import { AppStateEnum } from "./AppStateEnum";

export class StateMachine {
    state: AppState | undefined = undefined;
  
    states: Map<AppStateEnum, AppState> = new Map();
  
    constructor() {}
  
    public addState(state: AppState): void {
      this.states.set(state.state, state);
    }
  
    public changeState(state: AppStateEnum): void {
      if (this.state) {
        this.state.exit();
      }
      this.state = this.states.get(state);
      if (this.state) {
        this.state.enter();
      }
  
      EventService.dispatchEvent(EventEnum.APP_STATE_CHANGE, this.state?.state);
    }
  
    public isState(state: AppStateEnum): boolean {
      return this.state?.state === state;
    }
  
    public isNotState(state: AppStateEnum): boolean {
      return this.state?.state !== state;
    }
  }