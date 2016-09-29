"use strict";
var EndpointCommunicator = (function () {
    function EndpointCommunicator() {
        this.controlsByCtid = {};
        this.controls = {};
    }
    EndpointCommunicator.prototype.connect = function () { };
    ;
    Object.defineProperty(EndpointCommunicator.prototype, "endpoint_id", {
        get: function () {
            return this.config.endpoint._id;
        },
        enumerable: true,
        configurable: true
    });
    EndpointCommunicator.prototype.setConfig = function (config) {
        this.config = config;
    };
    EndpointCommunicator.prototype.getControlTemplates = function () {
        return {};
    };
    EndpointCommunicator.prototype.handleControlUpdateRequest = function (request) {
    };
    EndpointCommunicator.prototype.setTemplates = function (controls) {
        this.controls = controls;
        for (var id in controls) {
            this.controlsByCtid[controls[id].ctid] = controls[id];
        }
    };
    EndpointCommunicator.listCommunicators = function () {
        //for (let comm in communicators ) {
        //console.log("Comm: " + comm);
        //}
    };
    return EndpointCommunicator;
}());
exports.EndpointCommunicator = EndpointCommunicator;
//# sourceMappingURL=EndpointCommunicator.js.map