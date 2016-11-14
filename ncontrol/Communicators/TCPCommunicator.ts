import {EndpointCommunicator, IEndpointCommunicatorConfig} from "./EndpointCommunicator";
import { TCPCommand } from "./TCPCommand";
import * as net from "net";
import {Control} from "../shared/Control";

import * as debugMod from "debug";
import {ControlUpdateData} from "../shared/ControlUpdate";
import {EndpointStatus} from "../shared/Endpoint";
import {IndexedDataSet} from "../shared/DCDataModel";
//let debug = debugMod("comms");
let debug = console.log;

export class TCPCommunicator extends EndpointCommunicator {
    host: string;
    port : number;
    socket: net.Socket;
    commands: IndexedDataSet<TCPCommand> = {};
    commandsByTemplate: IndexedDataSet<TCPCommand> = {};
    inputLineTerminator = '\r\n';
    outputLineTerminator = '\r\n';
    socketEncoding = 'utf8';
    inputBuffer: string = '';
    pollTimer: any = 0;
    backoffTime: number = 1000;
    expectedResponses: [string | RegExp, (line: string) => any][] = [];


    constructor() {
        super();
    }

    buildCommandList() {

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

            self.doDeviceLogon();
        });

        this.socket.on('error', function(e) {
            debug("caught socket error: " + e.message);
            self.onEnd();
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

    disconnect() {
        this.socket.end();
        this.connected = false;
        this.config.statusUpdateCallback(EndpointStatus.Offline);
    }

    doDeviceLogon() {
        this.connected = true;
        this.config.statusUpdateCallback(EndpointStatus.Online);
        this.online();
    };

    executeCommandQuery(cmd: TCPCommand) {
        if (! cmd.queryString()) {
            return;
        }

        let self = this;
        let queryStr = cmd.queryString();
        debug("sending query: " + queryStr);
        this.socket.write(queryStr + this.outputLineTerminator);
        this.expectedResponses.push([
            cmd.queryResponseMatchString(),
            (line) => {
                for (let ctid of cmd.ctidList) {
                    let control = self.controlsByCtid[ctid];

                    let val = cmd.parseQueryResponse(control, line);
                    self.setControlValue(control, val);
                }

                self.connectionConfirmed();
            }
        ]);
    }

    getControlTemplates() : IndexedDataSet<Control> {
        this.buildCommandList();

        for (let cmd in this.commands) {
            let templateList = this.commands[cmd].getControlTemplates();

            for (let tpl of templateList) {
                this.controls[tpl._id] = tpl;
                this.controlsByCtid[tpl.ctid] = tpl;
                this.commandsByTemplate[tpl.ctid] = this.commands[cmd];
            }
        }

        return this.controlsByCtid;
    }

    handleControlUpdateRequest(request: ControlUpdateData) {
        if (! this.connected) {
            return;
        }

        let control = this.controls[request.control_id];
        let command = this.commandsByTemplate[control.ctid];

        let updateStr = command.updateString(control, request);
        debug("sending update: " + updateStr);
        this.socket.write(updateStr + this.outputLineTerminator);
        this.expectedResponses.push([
            command.updateResponseMatchString(request),
            (line) => {
                this.setControlValue(control, request.value);
            }
        ])

    }


    matchLineToCommand(line: string) : TCPCommand | boolean {
        for (let cmdStr in this.commands) {
            let cmd = this.commands[cmdStr];

            if (cmd.matchesReport(line)) {
                debug("read: " + line + ", matches cmd " + cmd.name);
                return cmd;
            }
        }

        return false;
    }

    matchLineToError(line: string) : boolean {

        return false;
    }

    matchLineToExpectedResponse(line: string) : boolean {
        for (let idx = 0; idx < this.expectedResponses.length; idx++) {
            let eresp = this.expectedResponses[idx];

            if (line.search(<string>eresp[0]) > -1 ) {
                debug(`${line} matched expected response "${eresp[0]}" at [${idx}]`);
                //Execute expected response callback
                eresp[1](line);

                this.expectedResponses = this.expectedResponses.slice(idx + 1);
                return true;
            }
        }

        return false;
    }

    onData(data: any) {
        let strData = String(data);

        this.inputBuffer += strData;
        let lines = this.inputBuffer.split(this.inputLineTerminator);

        while (lines.length > 1) {
            //debug("data recieved: " + lines[0]);
            this.processLine(lines[0]);

            lines.splice(0,1);
        }

        this.inputBuffer = lines[0];
    }

    onEnd() {
        let self = this;
        if (this.config.endpoint.enabled) {
            debug("device disconnected " + this.host + ", reconnect in " + this.backoffTime + "ms");
            this.connected = false;

            this.config.statusUpdateCallback(EndpointStatus.Offline);

            if (! this.socket["destroyed"]) {  // socket.destroyed is missing from Typings file
                debug("destroying socket");
                this.socket.destroy();
            }

            setTimeout(function () {
                self.connect();
            }, this.backoffTime);

            if (this.backoffTime < 20000) {
                this.backoffTime = this.backoffTime * 2;
            }
        }
        else {
            debug("successfully disconnected from " + this.host);
        }
    }

    /**
     *  Functions to perform when device connection has been confirmed
     */
    online() {
        this.queryAll();
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
                    this.executeCommandQuery(cmd);
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

        //Ignore empty lines
        if (line == '') return;

        if (this.matchLineToError(line)) {
            return;
        }

        // Check line against expected responses
        if (this.matchLineToExpectedResponse(line)) {
            return;
        }

        // Match line to a command
        let match = this.matchLineToCommand(line);


        if (match) {
            let cmd = <TCPCommand>match;
            for (let ctid of cmd.ctidList) {
                let control = this.controlsByCtid[ctid];

                let val = cmd.parseReportValue(control, line);
                this.setControlValue(control, val);
            }

            this.connectionConfirmed();

        }
        else {
            debug("read, unmatched: " + line );
        }
    }

    /**
     * Query all controls, regardless of poll setting.
     *
     * Override this method to exclude polling of certain controls
     */

    queryAll() {
        for (let cmdStr in this.commands) {
            if (! this.commands[cmdStr].writeonly) {
                this.executeCommandQuery(this.commands[cmdStr]);
            }
        }
    }

    setControlValue(control: Control, val: any) {
        if (control.value != val) {
            if (typeof val == 'object') {
                // Don't send update if nothing will change
                if (JSON.stringify(control.value) == JSON.stringify(val)) {
                    return;
                }
            }

            debug(`control update: ${control.name} = ${val}`);
            this.config.controlUpdateCallback(control, val);
            control.value = val;
        }
    }

    setTemplates(templates: IndexedDataSet<Control>) {
        super.setTemplates(templates);
    }

}