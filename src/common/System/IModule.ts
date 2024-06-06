export interface IModule {
    initialize(logindata:any): void;
    start(): void;
    destroy(): void;
}

export interface ISystemModule extends IModule {
    initialize(): void;
}