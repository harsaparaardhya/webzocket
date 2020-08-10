interface Config {
    roomId: string;
    timeout: number;
    log: (log: Log) => void;
}

interface Message {
  destination: string;
  key: string;
  value: any;
}

interface Subscribe {
    key: string;
    callback: (any: any) => void;
}

interface Log {
  type: string,
  code: string
}

export { Config , Message , Subscribe , Log };
