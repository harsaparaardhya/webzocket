let socket: any = false;
const messages: any[] = [];
const receivers: any[] = [];

setInterval(() => {
  if (messages.length > 0 && socket) {
    const message = messages[0];
    socket.send(JSON.stringify(message));

    messages.shift();
  }
} , 100);

const send = (destination: string, key: string, value: any) => {
  const message = {
    destination: destination,
    key: key,
    value: value
  };
  messages.push(message);
}

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
  me: (key: string, value: any) => {
    send("me", key, value);
  },
  we: (key: string, value: any) => {
    send("we", key, value);
  },
  other: (key: string, value: any) => {
    send("other", key, value);
  },
  receiver: (key: string, callback: (a: any) => void) => {
    const receiver = {
      key: key,
      callback: callback
    };
    receivers.push(receiver);
  }
};

export { WebZocket };
