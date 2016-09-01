"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("./TCPCommunicator");
var ExtronDXPCommunicator = (function (_super) {
    __extends(ExtronDXPCommunicator, _super);
    function ExtronDXPCommunicator(endpoint) {
        _super.call(this, endpoint);
    }
    return ExtronDXPCommunicator;
}(TCPCommunicator_1.TCPCommunicator));
exports.ExtronDXPCommunicator = ExtronDXPCommunicator;
//# sourceMappingURL=ExtronDXPCommunicator.js.map