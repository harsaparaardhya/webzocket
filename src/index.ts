import { config , message , receiver } from './interface';

let c: config = {
  roomId: "",
  production: false
};
let socket: any = false;
const messages: message[] = [];
const receivers: receiver[] = [];

setInterval(() => {
  if (messages.length > 0 && socket.bufferedAmount == 0) {
    const message = messages[0];
    socket.send(JSON.stringify(message));

    messages.shift();
  }
} , 100);

const send = (destination: string, key: string, value: any) => {
  const m: message = {
    destination: destination,
    key: key,
    value: value
  };

  if (socket)
    messages.push(m);
}

const cons = (type: string, message: any) => {
  if (!c.production) {
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

const webzocket = {
  init: (conf: config) => {
    c = {...c,...conf};

    const roomId = window.atob(c.roomId).split("::");
    if (roomId.length == 2 && WebSocket) {
      socket = new WebSocket(roomId[0], roomId[1]);
      socket.onopen = (e: any) => {
        cons("info", "socket connected");
      };

      socket.onmessage = (event: any) => {
        const data = JSON.parse(event.data);

        if (data.error) {
          const error = data.error;
          cons(error.type, error.message);
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
          webzocket.init(c);
        }, 5000);
      };

      socket.onerror = (error: any) => {
        cons("error", "socket error");
      };
    } else if (!WebSocket) {
      cons("warn", "socket not support");
    } else {
      cons("error", "socket invalid");
    }
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
    const r: receiver = {
      key: key,
      callback: callback
    };
    receivers.push(r);
  }
};

export { webzocket };
