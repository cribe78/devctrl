import { TCPCommunicator } from "./TCPCommunicator";
import { Endpoint } from "../../shared/Shared";

export class ExtronDXPCommunicator extends TCPCommunicator {
    constructor(endpoint: Endpoint) {
        super(endpoint);
    }
}