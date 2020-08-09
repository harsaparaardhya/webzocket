import { Config , Message , Subscribe , Log } from './interface';

class WebZocket {
  private config: Config = {
    roomId: "",
    timeout: 5000,
    log: (log: Log) => {}
  };
  private socket: any = false;
  private messages: Message[] = [];
  private subscribes: Subscribe[] = [];

  constructor(config: Config) {
    this.init(config);

    setInterval(() => {
      if (this.socket) {
        if (this.messages.length > 0 && this.socket.bufferedAmount == 0) {
          const message = this.messages[0];
          this.socket.send(JSON.stringify(message));

          this.messages.shift();
        }
      }
    } , 100);
  }

  private init(config: Config) {
    this.config = {...this.config,...config};
    const roomId = window.atob(this.config.roomId).split("::");
    if (roomId.length == 2 && WebSocket) {
      this.socket = new WebSocket(roomId[0], roomId[1]);
      this.socket.onopen = (e: any) => {
        this.cons("info", "socket_connected");
      };

      this.socket.onmessage = (event: any) => {
        const data = JSON.parse(event.data);

        if (data.error) {
          const error = data.error;
          this.cons(error.type, error.message);
        } else {
          for (const a in this.subscribes) {
            const subscribe = this.subscribes[a];
            if (data.key == subscribe.key) subscribe.callback(data.value);
          }
        }
      };

      this.socket.onclose = () => {
        this.socket = null;
        setTimeout(() => {
          this.init(this.config);
        }, this.config.timeout);
      };

      this.socket.onerror = (error: any) => {
        this.cons("error", "socket_error");
      };
    } else if (!WebSocket) {
      this.cons("warn", "socket_not_support");
    } else {
      this.cons("error", "socket_invalid");
    }
  }

  public me(key: string, value: any) {
    this.send("me", key, value);
    return this;
  }

  public we(key: string, value: any) {
    this.send("we", key, value);
    return this;
  }

  public other(key: string, value: any) {
    this.send("other", key, value);
    return this;
  }

  public subscribe(key: string, callback: (any: any) => void) {
    const subscribe: Subscribe = {
      key: key,
      callback: callback
    };
    this.subscribes.push(subscribe);

    return this;
  }

  private send(destination: string, key: string, value: any) {
    const m: Message = {
      destination: destination,
      key: key,
      value: value
    };

    if (this.socket)
      this.messages.push(m);
  }

  private cons(type: string, message: string) {
    const log: Log = {
      type: type,
      code: message,
      message: message
    }
    this.config.log(log);
  }
}

export { WebZocket };
