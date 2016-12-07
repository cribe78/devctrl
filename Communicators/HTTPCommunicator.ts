
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

    constructor() {
        super();
    }

    buildCommandList() : void {}

    connect() {
        this._connected = true;
        this.config.statusUpdateCallback(EndpointStatus.Online);
    };

    disconnect() {
        this._connected = false;
        this.config.statusUpdateCallback(EndpointStatus.Offline);
    };


    getControlTemplates() : IndexedDataSet<Control> {
        this.buildCommandList();

        for (let cmd in this.commands) {
            let controls = this.commands[cmd].getControls();

            for (let control of controls) {
                this.controlsByCtid[control.ctid] = control;
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

        http.get("http://" + requestOptions.hostname + requestOptions.path, (res) => {
            if (res.statusCode !== 200) {
                debug("invalid status code response: " + res.statusCode);
            }
            else {
                debug(`preset ${update.value} successfully selected`);
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

    setTemplates(controls: IndexedDataSet<Control>) {
        this.controls = controls;

        for (let id in controls) {
            this.controlsByCtid[controls[id].ctid] = controls[id];
        }
    }

}
