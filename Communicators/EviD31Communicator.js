"use strict";
const TCPCommunicator_1 = require("./TCPCommunicator");
//TODO: Implement EviD31Communicator
class EviD31Communicator extends TCPCommunicator_1.TCPCommunicator {
    constructor() {
        super();
    }
    buildCommandList() {
    }
    connect() {
        console.log("connecting to EviD31");
    }
}
let communicator = new EviD31Communicator();
module.exports = communicator;
//# sourceMappingURL=EviD31Communicator.js.map