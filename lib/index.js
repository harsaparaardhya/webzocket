"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebZocket = void 0;
var Message = /** @class */ (function () {
  function Message(key, destination, value) {
    this.key = key;
    this.destination = destination;
    this.value = value;
    var message = {
      key: key,
      destination: destination,
      value: value,
    };
    this.msg = JSON.stringify(message);
  }
  return Message;
})();
var Receiver = /** @class */ (function () {
  function Receiver(key, callback) {
    this.key = key;
    this.callback = callback;
    var receiver = {
      key: key,
      callback: callback,
    };
    this.rcv = receiver;
  }
  return Receiver;
})();
var WebZocket = /** @class */ (function () {
  function WebZocket() {
    this.socket = false;
    this.receivers = [];
  }
  WebZocket.prototype.init = function (room) {
    var _this = this;
    this.socket = new WebSocket("ws://localhost:8080/", room);
    this.socket.onopen = function (e) {};
    this.socket.onmessage = function (event) {
      var data = JSON.parse(event.data);
      for (var a = 0; a < _this.receivers.length; a++) {
        var receiver = _this.receivers[a];
        if (data.key == receiver.key) receiver.callback(data.value);
      }
    };
    this.socket.onclose = function () {
      _this.socket = null;
      setTimeout(_this.init, 5000);
    };
    this.socket.onerror = function (error) {
      console.log(error);
    };
  };
  WebZocket.prototype.trigger = function (key, destination, value) {
    var message = new Message(key, destination, value);
    if (this.socket) this.socket.send(message.msg);
  };
  WebZocket.prototype.receiver = function (key, callback) {
    var receiver = new Receiver(key, callback);
    this.receivers.push(receiver.rcv);
  };
  return WebZocket;
})();
exports.WebZocket = WebZocket;
//# sourceMappingURL=index.js.map
