import {EndpointCommunicator, IEndpointCommunicatorConfig} from "../EndpointCommunicator";
import { TCPCommand } from "./TCPCommand";
import {
    Endpoint,
    IndexedDataSet
} from "../../shared/Shared";
import * as net from "net";



export class TCPCommunicator extends EndpointCommunicator {
    host: string;
    port : number;
    socket: net.Socket;
    connected: boolean = false;
    commands: IndexedDataSet<TCPCommand> = {};


    constructor() {
        super();
    }

    connect() {
        let self = this;

        this.host = this.config.endpoint.ip;
        this.port = this.config.endpoint.port;

        let connectOpts = {
            port: this.config.endpoint.port,
            host: this.config.endpoint.ip
        };
        this.socket = net.connect(connectOpts, function() {
            console.log("connected to " + connectOpts.host + ":" + connectOpts.port);
            self.connected = true;
        });

        this.socket.on('data', this.onData);
        this.socket.on('end', this.onEnd);
    }

    onData(data: any) {
        console.log("data received: " + data);
    }

    onEnd() {
        console.log("device disconnected " + this.host);
        this.connected = false;
    }

}