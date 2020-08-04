interface WebZocketConfig {
    url: string;
    production: boolean;
}

let config: WebZocketConfig = {
  url: "Ojo=",
  production: false
};
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

const cons = (type: string, message: any) => {
  if (!config.production) {
    switch (type) {
      case "info":
        console.info(message);
        break;

      case "warn":
        console.warn(message);
        break;

      case "error":
        console.error(message);
        break;
    }
  }
}

const WebZocket = {
  init: (conf: WebZocketConfig) => {
    config = {...config,...conf};

    const url = window.atob(config.url).split("::");
    socket = new WebSocket(url[0], url[1]);
    socket.onopen = (e: any) => {
      cons("info", "connected");
    };

    socket.onmessage = (event: any) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        cons("error", data.error);
      } else {
        for (const a in receivers) {
          const receiver = receivers[a];
          if (data.key == receiver.key) receiver.callback(data.value);
        }
      }
    };

    socket.onclose = () => {
      socket = null;
      setTimeout(() => {
        WebZocket.init(config);
      }, 5000);
    };

    socket.onerror = (error: any) => {
      cons("error", error);
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
