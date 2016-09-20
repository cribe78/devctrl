"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EndpointCommunicator_1 = require("../EndpointCommunicator");
var net = require("net");
var TCPCommunicator = (function (_super) {
    __extends(TCPCommunicator, _super);
    function TCPCommunicator() {
        _super.call(this);
        this.connected = false;
        this.commands = {};
    }
    TCPCommunicator.prototype.connect = function () {
        var self = this;
        this.host = this.config.endpoint.ip;
        this.port = this.config.endpoint.port;
        var connectOpts = {
            port: this.config.endpoint.port,
            host: this.config.endpoint.ip
        };
        this.socket = net.connect(connectOpts, function () {
            console.log("connected to " + connectOpts.host + ":" + connectOpts.port);
            self.connected = true;
        });
        this.socket.on('data', this.onData);
        this.socket.on('end', this.onEnd);
    };
    TCPCommunicator.prototype.onData = function (data) {
        console.log("data received: " + data);
    };
    TCPCommunicator.prototype.onEnd = function () {
        console.log("device disconnected " + this.host);
        this.connected = false;
    };
    return TCPCommunicator;
}(EndpointCommunicator_1.EndpointCommunicator));
exports.TCPCommunicator = TCPCommunicator;
//# sourceMappingURL=TCPCommunicator.js.map