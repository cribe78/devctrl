"use strict";
var EndpointCommunicator = (function () {
    function EndpointCommunicator() {
        this.templatesByCtid = {};
    }
    EndpointCommunicator.prototype.connect = function () { };
    ;
    EndpointCommunicator.prototype.setConfig = function (config) {
        this.config = config;
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