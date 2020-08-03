"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebZocket = void 0;
var WebZocket = /** @class */ (function () {
    function WebZocket() {
        this.socket = false;
        this.receivers = [];
    }
    WebZocket.prototype.init = function (room) {
        var _this = this;
        this.socket = new WebSocket("ws://localhost:8080/", room);
        this.socket.onopen = function (e) { };
        this.socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            for (var a = 0; a < _this.receivers.length; a++) {
                var receiver = _this.receivers[a];
                if (data.key == receiver.key)
                    receiver.callback(data.value);
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
        var message = {
            key: key,
            destination: destination,
            value: value,
        };
        if (this.socket)
            this.socket.send(JSON.stringify(message));
    };
    WebZocket.prototype.receiver = function (key, callback) {
        var receiver = {
            key: key,
            callback: callback,
        };
        this.receivers.push(receiver);
    };
    return WebZocket;
}());
exports.WebZocket = WebZocket;
//# sourceMappingURL=index.js.map