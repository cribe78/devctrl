import {EndpointCommunicator, IEndpointCommunicatorConfig} from "../EndpointCommunicator";
import { TCPCommand } from "./TCPCommand";
import {
    Endpoint,
    IndexedDataSet
} from "../../shared/Shared";
import * as net from "net";
import {ControlTemplate} from "../../shared/ControlTemplate";

import * as debugMod from "debug";
let debug = debugMod("comms");


export class TCPCommunicator extends EndpointCommunicator {
    host: string;
    port : number;
    socket: net.Socket;
    connected: boolean = false;
    commands: IndexedDataSet<TCPCommand> = {};
    controlTemplates: IndexedDataSet<ControlTemplate> = {};
    lineTerminator = /\r\n/;
    socketEncoding = 'utf8';


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
            debug("connected to " + connectOpts.host + ":" + connectOpts.port);
            self.connected = true;
        });

        this.socket.on('data', function(data) {
            self.onData(data);
        });
        this.socket.on('end', function() {
            self.onEnd();
        });

        setTimeout(function() {
            self.poll();
        }, 10000);
    }

    getControlTemplates() : IndexedDataSet<ControlTemplate> {
        return this.controlTemplates;
    }

    onData(data: any) {
        let strData = String(data);
        let lines = strData.split(this.lineTerminator);

        for(let line of lines) {
            debug("data received: " + line);
        }

    }

    onEnd() {
        debug("device disconnected " + this.host);
        this.connected = false;

        this.connect();
    }

    poll() {
        debug("polling device");

        for (let cmdStr in this.commands) {
            let cmd = this.commands[cmdStr];

        }
    }

}