import { TCPCommunicator } from "./TCPCommunicator";
import { Endpoint } from "../../shared/Shared";

class EviD31Communicator extends TCPCommunicator {
    constructor() {
        super();
    }

    connect() {
        console.log("connecting to EviD31");
    }
}

let communicator = new EviD31Communicator();
module.exports = communicator;