"use strict";
var EndpointCommunicator = (function () {
    function EndpointCommunicator(endpoint) {
        this.endpoint = endpoint;
    }
    EndpointCommunicator.initSubtype = function (endpoint) {
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