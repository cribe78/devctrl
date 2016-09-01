import { EndpointCommunicator } from "../EndpointCommunicator";
import { Endpoint } from "../../shared/Shared";

export class TCPCommunicator extends EndpointCommunicator {
    host: string;
    port : number;

    constructor(endpoint: Endpoint) {
        super(endpoint);
    }

}