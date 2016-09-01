"use strict";
var io = require("socket.io-client");
var EndpointCommunicator_1 = require("./EndpointCommunicator");
var NControl = (function () {
    function NControl() {
    }
    NControl.bootstrap = function () {
        return new NControl();
    };
    NControl.prototype.run = function (config) {
        var self = this;
        this.io = io.connect(config.wsUrl);
        this.io.on('connect', function () {
            console.log("websocket client connected");
            self.getEndpointConfig(config);
            //Get endpoint data
            EndpointCommunicator_1.EndpointCommunicator.listCommunicators();
        });
        console.log("testString is " + config.testString);
    };
    NControl.prototype.getEndpointConfig = function (config) {
        var reqData = {
            table: "control_endpoints",
            params: { _id: config.endpointId }
        };
        this.io.emit('get-data', reqData, function (data) {
            console.log("endpoint data recieved");
            var epData = data.add.control_endpoints[config.endpointId];
            console.log("ep type: " + epData.type);
        });
    };
    return NControl;
}());
var ncontrol = NControl.bootstrap();
module.exports = ncontrol;
//# sourceMappingURL=ncontrol.js.map