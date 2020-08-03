class Message {
  msg: string;
  constructor(
    public key: string,
    public destination: string,
    public value: any
  ) {
    const message = {
      key: key,
      destination: destination,
      value: value,
    };
    this.msg = JSON.stringify(message);
  }
}

class Receiver {
  rcv: any;
  constructor(public key: string, public callback: any) {
    const receiver = {
      key: key,
      callback: callback,
    };
    this.rcv = receiver;
  }
}

class WebZocket {
  socket: any = false;
  receivers: any[] = [];

  constructor() {}

  init(room: string) {
    this.socket = new WebSocket("ws://localhost:8080/", room);

    this.socket.onopen = (e: any) => {};

    this.socket.onmessage = (event: any) => {
      const data = JSON.parse(event.data);

      for (let a = 0; a < this.receivers.length; a++) {
        const receiver = this.receivers[a];
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
    const message = new Message(key, destination, value);

    if (this.socket) this.socket.send(message.msg);
  }

  receiver(key: string, callback: any) {
    const receiver = new Receiver(key, callback);
    this.receivers.push(receiver.rcv);
  }
}

export { WebZocket };
