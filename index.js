module.exports.webzocket = () {
  this.socket = false;
  this.receivers = [];

  this.init = (room) => {
    this.socket = new WebSocket("ws://localhost:8080/" , room);

    this.socket.onopen = (event) => {
      console.log(event);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      for (const a in this.receivers) {
        const receiver = receivers[a];
        if (data.key == receiver.key)
          receiver.callback(data.value);
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      setTimeout(this.init, 5000);
    };

    this.socket.onerror = (error) => {
      console.log(error.message);
    };
  }

  this.trigger = (name, destination, text) => {
    const message = {
      key: name,
      destination: destination,
      value: text
    };

    if (this.socket)
      this.socket.send(JSON.stringify(message));
  }

  this.receiver = (key, callback) => {
    const receiver = {
      key: key,
      callback: callback
    }

    this.receivers.push(receiver);
  }
};
