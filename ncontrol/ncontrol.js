"use strict";
var io = require("socket.io-client");
var Shared_1 = require("../shared/Shared");
var EndpointCommunicator_1 = require("./EndpointCommunicator");
var NControl = (function () {
    function NControl() {
        this.dataModel = new Shared_1.DCDataModel();
    }
    NControl.bootstrap = function () {
        return new NControl();
    };
    NControl.prototype.run = function (config) {
        var self = this;
        this.config = config;
        this.io = io.connect(config.wsUrl);
        this.io.on('connect', function () {
            console.log("websocket client connected");
            //Get endpoint data
            self.getEndpointConfig();
            EndpointCommunicator_1.EndpointCommunicator.listCommunicators();
        });
        console.log("testString is " + config.testString);
    };
    NControl.prototype.getEndpointConfig = function () {
        var self = this;
        self.endpoint = self.dataModel.getItem(self.config.endpointId, Shared_1.Endpoint.tableStr);
        var reqData = self.endpoint.itemRequestData();
        this.io.emit('get-data', reqData, function (data) {
            console.log("endpoint data received");
            self.dataModel.loadData(data);
            self.getEndpointTypeConfig();
        });
    };
    NControl.prototype.getEndpointTypeConfig = function () {
        var self = this;
        if (!self.endpoint.dataLoaded) {
            console.log("endpoint data is missing");
            return;
        }
        var epTypeRequestData = self.endpoint.type.itemRequestData();
        this.io.emit('get-data', epTypeRequestData, function (eptData) {
            console.log("endpoint type data received");
            self.dataModel.loadData(eptData);
        });
    };
    return NControl;
}());
var ncontrol = NControl.bootstrap();
module.exports = ncontrol;
//# sourceMappingURL=ncontrol.js.map