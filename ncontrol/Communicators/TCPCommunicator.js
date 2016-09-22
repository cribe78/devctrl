"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EndpointCommunicator_1 = require("../EndpointCommunicator");
var net = require("net");
var debugMod = require("debug");
var debug = debugMod("comms");
var TCPCommunicator = (function (_super) {
    __extends(TCPCommunicator, _super);
    function TCPCommunicator() {
        _super.call(this);
        this.connected = false;
        this.commands = {};
        this.controlTemplates = {};
        this.lineTerminator = /\r\n/;
        this.socketEncoding = 'utf8';
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
            debug("connected to " + connectOpts.host + ":" + connectOpts.port);
            self.connected = true;
        });
        this.socket.on('data', function (data) {
            self.onData(data);
        });
        this.socket.on('end', function () {
            self.onEnd();
        });
        setTimeout(function () {
            self.poll();
        }, 10000);
    };
    TCPCommunicator.prototype.getControlTemplates = function () {
        return this.controlTemplates;
    };
    TCPCommunicator.prototype.onData = function (data) {
        var strData = String(data);
        var lines = strData.split(this.lineTerminator);
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            debug("data received: " + line);
        }
    };
    TCPCommunicator.prototype.onEnd = function () {
        debug("device disconnected " + this.host);
        this.connected = false;
        this.connect();
    };
    TCPCommunicator.prototype.poll = function () {
        debug("polling device");
        for (var cmdStr in this.commands) {
            var cmd = this.commands[cmdStr];
        }
    };
    return TCPCommunicator;
}(EndpointCommunicator_1.EndpointCommunicator));
exports.TCPCommunicator = TCPCommunicator;
//# sourceMappingURL=TCPCommunicator.js.map