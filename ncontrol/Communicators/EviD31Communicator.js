"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TCPCommunicator_1 = require("./TCPCommunicator");
var EviD31Communicator = (function (_super) {
    __extends(EviD31Communicator, _super);
    function EviD31Communicator() {
        _super.call(this);
    }
    EviD31Communicator.prototype.buildCommandList = function () {
    };
    EviD31Communicator.prototype.connect = function () {
        console.log("connecting to EviD31");
    };
    return EviD31Communicator;
}(TCPCommunicator_1.TCPCommunicator));
var communicator = new EviD31Communicator();
module.exports = communicator;
//# sourceMappingURL=EviD31Communicator.js.map