let socket: any = false;
const receivers: any[] = [];

const WebZocket = {
  init: (conf: string) => {
    const configs = window.atob(conf);
    const config = configs.split("::");
    socket = new WebSocket(config[0], config[1]);
    socket.onopen = (e: any) => {};

    socket.onmessage = (event: any) => {
      const data = JSON.parse(event.data);

      for (const a in receivers) {
        const receiver = receivers[a];
        if (data.key == receiver.key) receiver.callback(data.value);
      }
    };

    socket.onclose = () => {
      socket = null;
      setTimeout(WebZocket.init, 5000);
    };

    socket.onerror = (error: any) => {
      console.log(error);
    };
  },
  trigger: (key: string, destination: string, value: any) => {
    const message = {
      key: key,
      destination: destination,
      value: value,
    };

    if (socket) socket.send(JSON.stringify(message));
  },
  receiver: (key: string, callback: (a: any) => void) => {
    const receiver = {
      key: key,
      callback: callback
    };
    receivers.push(receiver);
  }
};

/*
class WebZocket {
  private socket: any = false;

  constructor() {}

  init(conf: string) {
    const configs = window.atob(conf);
    const config = configs.split("::");
    this.socket = new WebSocket(config[0], config[1]);
    this.socket.onopen = (e: any) => {};

    this.socket.onmessage = (event: any) => {
      const data = JSON.parse(event.data);

      for (const a in receivers) {
        const receiver = receivers[a];
        if (data.key == receiver.key) receiver.callback(data.value);
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      setTimeout(this.init, 5000);
    };

    this.socket.onerror = (error: any) => {
      console.log(error);
    };
  }

  trigger(key: string, destination: string, value: any) {
    const message = {
      key: key,
      destination: destination,
      value: value,
    };

    if (this.socket) this.socket.send(JSON.stringify(message));
  }

  receiver(key: string, callback: (a: any) => void) {
    const receiver = {
      key: key,
      callback: callback
    };
    receivers.push(receiver);
  }
}
*/

export { WebZocket };
