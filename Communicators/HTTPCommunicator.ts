
import {Control} from "../shared/Control";
import {ControlUpdateData} from "../shared/ControlUpdate";
import {EndpointStatus, Endpoint} from "../shared/Endpoint";
import {IndexedDataSet} from "../shared/DCDataModel";
import {EndpointCommunicator} from "./EndpointCommunicator";
import {HTTPCommand} from "./HTTPCommand";
import * as http from "http";

let debug = console.log;

export class HTTPCommunicator extends EndpointCommunicator {
    commands: IndexedDataSet<HTTPCommand> = {};
    commandsByControl: IndexedDataSet<HTTPCommand> = {};
    pollTimer;

    constructor() {
        super();
    }

    buildCommandList() : void {}

    connect() {
        this._connected = true;
        this.config.statusUpdateCallback(EndpointStatus.Online);

        if (! this.pollTimer) {
            this.pollTimer = setInterval(() => {
                this.poll();
            }, 10000);
        }
    };

    disconnect() {
        this._connected = false;
        this.config.statusUpdateCallback(EndpointStatus.Offline);
    };

    executeCommandQuery(cmd: HTTPCommand) {
        if (cmd.writeonly) {
            debug(`not querying writeonly command ${cmd.name}`);
        }


        let control = this.controlsByCtid[cmd.controlData.ctid];
        let requestOptions = {
            hostname: this.config.endpoint.address,
            path: cmd.queryPath()
        };

        let requestPath = "http://" + requestOptions.hostname + requestOptions.path;
        debug("sending request:" + requestPath);

        http.get(requestPath, (res) => {
            if (res.statusCode !== 200) {
                debug("invalid status code response: " + res.statusCode);
            }
            else {
                debug(`cmd ${cmd.name} successfully queried`);
                res.setEncoding('utf8');
                let body ='';
                res.on('data', (chunk) => { body += chunk});
                res.on('end', () => {
                    let val = cmd.parseQueryResponse(body);
                    if (typeof val !== 'undefined') {
                        debug(`${cmd.name} response parsed: ${body}`);
                        this.config.controlUpdateCallback(control, val);
                    }
                    else {
                        debug(`${cmd.name} update response did not match: ${body}`);
                    }
                });
            }
        });
    }

    getControlTemplates() : IndexedDataSet<Control> {
        this.buildCommandList();

        for (let cmd in this.commands) {
            let controls = this.commands[cmd].getControls();

            for (let control of controls) {
                this.controlsByCtid[control.ctid] = control;
                this.commandsByControl[control.ctid] = this.commands[cmd];
            }
        }

        return this.controlsByCtid;
    }

    /**
     * Process a ControlUpdate, likely by sending a command to
     * a device
     * @param update ControlUpdateData The request control update
     */
    handleControlUpdateRequest(update: ControlUpdateData) {
        let control = this.controls[update.control_id];
        let command = this.commands[control.ctid];

        if (! command) {
            debug(`No command found for control ${control.name}`);
            return;
        }

        let requestOptions = {
            hostname: this.config.endpoint.address,
            path: command.commandPath(update.value)
        };

        let requestPath = "http://" + requestOptions.hostname + requestOptions.path;
        debug("sending request:" + requestPath);

        http.get(requestPath, (res) => {
            if (res.statusCode !== 200) {
                debug("invalid status code response: " + res.statusCode);
            }
            else {
                debug(`${command.name} set to ${update.value} successfully`);
                res.setEncoding('utf8');
                let body ='';
                res.on('data', (chunk) => { body += chunk});
                res.on('end', () => {
                    if (command.matchResponse(body)) {
                        debug(`${control.name} response matched expected`);
                        this.config.controlUpdateCallback(control, update.value);
                    }
                    else {
                        debug(`${control.name} update response did not match: ${body}`);
                    }
                });
            }
        });
    }

    poll() {
        if (! this.connected) {
            return;
        }

        debug("polling device");

        for (let id in this.controls) {
            let control = this.controls[id];

            if (control.poll) {
                let cmd = this.commandsByControl[control.ctid];

                if (cmd) {
                    this.executeCommandQuery(cmd);
                }
                else {
                    debug("command not found for poll control " + control.ctid);
                }
            }
        }
    }


    setTemplates(controls: IndexedDataSet<Control>) {
        this.controls = controls;

        for (let id in controls) {
            this.controlsByCtid[controls[id].ctid] = controls[id];
        }
    }

}
