import {EndpointCommunicator, IEndpointCommunicatorConfig} from "../EndpointCommunicator";
import { TCPCommand } from "./TCPCommand";
import {
    Endpoint,
    IndexedDataSet
} from "../../shared/Shared";
import * as net from "net";
import {Control} from "../../shared/Control";

import * as debugMod from "debug";
import {ControlUpdateData} from "../../shared/ControlUpdate";
let debug = debugMod("comms");


export class TCPCommunicator extends EndpointCommunicator {
    host: string;
    port : number;
    socket: net.Socket;
    connected: boolean = false;
    commands: IndexedDataSet<TCPCommand> = {};
    commandsByTemplate: IndexedDataSet<TCPCommand> = {};
    lineTerminator = '\r\n';
    socketEncoding = 'utf8';
    inputBuffer: string = '';
    pollTimer: any = 0;
    backoffTime: number = 1000;


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

        if (! this.pollTimer) {
            this.pollTimer = setInterval(function () {
                self.poll();
            }, 10000);
        }
    }

    connectionConfirmed() {
        this.backoffTime = 1000;
    }

    getControlTemplates() : IndexedDataSet<Control> {
        return this.controlsByCtid;
    }

    handleControlUpdateRequest(request: ControlUpdateData) {
        if (! this.connected) {
            return;
        }

        let control = this.controls[request.control_id];
        let command = this.commandsByTemplate[control.ctid];

        let updateStr = command.deviceUpdateString(control, request);
        debug("sending update: " + updateStr);
        this.socket.write(updateStr + this.lineTerminator);
    }

    onData(data: any) {
        let strData = String(data);

        this.inputBuffer += strData;
        let lines = this.inputBuffer.split(this.lineTerminator);

        while (lines.length > 1) {
            //debug("data recieved: " + lines[0]);
            this.processLine(lines[0]);

            lines.splice(0,1);
        }

        this.inputBuffer = lines[0];
    }

    onEnd() {
        let self = this;
        debug("device disconnected " + this.host + ", reconnect in " + this.backoffTime + "ms");
        this.connected = false;


        setTimeout(function() {
            self.connect();
        }, this.backoffTime);

        if (this.backoffTime < 20000) {
            this.backoffTime = this.backoffTime * 2;
        }
    }

    poll() {
        if (! this.connected) {
            return;
        }

        debug("polling device");

        for (let id in this.controls) {
            let control = this.controls[id];

            if (control.poll) {
                let cmd = this.commandsByTemplate[control.ctid];

                if (cmd) {
                    let queryStr = cmd.deviceQueryString();
                    debug("sending query: " + queryStr);
                    this.socket.write(queryStr + this.lineTerminator);
                }
                else {
                    debug("command not found for poll control " + control.ctid);
                }
            }
        }
    }

    preprocessLine(line: string) : string {
        return line;
    }

    processLine(line: string) {
        line = this.preprocessLine(line);
        // Match line to a command
        let matched = false;
        for (let cmdStr in this.commands) {
            let cmd = this.commands[cmdStr];

            if (cmd.matchesDeviceString(line)) {
                matched = true;
                debug("read: " + line + ", matches cmd " + cmd.name);

                for (let ctid of cmd.ctidList) {
                    let control =  this.controlsByCtid[ctid];

                    let val = cmd.parseControlValue(control, line);

                    if (control.value != val ) {
                        this.config.controlUpdateCallback(control, val);
                        control.value = val;
                    }
                }

                break;
            }
        }

        if (! matched) {
            debug("read, unmatched: " + line );
        }
        else {
            this.connectionConfirmed();
        }
    }

    setTemplates(templates: IndexedDataSet<Control>) {
        super.setTemplates(templates);
    }

}