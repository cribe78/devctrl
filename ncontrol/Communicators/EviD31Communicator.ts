import { TCPCommunicator } from "./TCPCommunicator";

class EviD31Communicator extends TCPCommunicator {
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