const { ipcRenderer } = window.require('electron');


class Queue<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    enqueue(element: T): void {
        this.items.push(element);
    }

    dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.shift();
    }

    peek(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    clear(): void {
        this.items = [];
    }
}


export const CacheQueueService = {
    queue: new Map<string, Queue<any>>(),
    save(key:string, value:any) {
        if (!this.queue.has(key)) {
            this.queue.set(key, new Queue());
        }
        console.log(">>>>>save",key,value);
        
        this.queue.get(key)?.enqueue(value);
    },
    get(key:string) {
        return this.queue.get(key)?.dequeue();
    },
}


ipcRenderer.on("storage", (event, data:{channel:string,message:any}) => {
    const { channel,message} = data
    console.log(">>>on",data);
    
    CacheQueueService.save(channel, message);
});
