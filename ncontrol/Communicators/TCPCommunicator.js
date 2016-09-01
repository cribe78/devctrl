"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EndpointCommunicator_1 = require("../EndpointCommunicator");
var TCPCommunicator = (function (_super) {
    __extends(TCPCommunicator, _super);
    function TCPCommunicator(endpoint) {
        _super.call(this, endpoint);
    }
    return TCPCommunicator;
}(EndpointCommunicator_1.EndpointCommunicator));
exports.TCPCommunicator = TCPCommunicator;
//# sourceMappingURL=TCPCommunicator.js.map