declare class WebZocket {
    socket: any;
    receivers: any[];
    constructor();
    init(room: string): void;
    trigger(key: string, destination: string, value: any): void;
    receiver(key: string, callback: any): void;
}
export { WebZocket };
//# sourceMappingURL=index.d.ts.map