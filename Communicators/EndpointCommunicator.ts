
import {Control} from "../shared/Control";
import {ControlUpdateData} from "../shared/ControlUpdate";
import {EndpointStatus, Endpoint} from "../shared/Endpoint";
import {IndexedDataSet} from "../shared/DCDataModel";


export interface IEndpointCommunicatorConfig {
    endpoint: Endpoint
    controlUpdateCallback: (control: Control, value: any) => void;
    statusUpdateCallback: (status: EndpointStatus) => void;
}

let debug = console.log;

export class EndpointCommunicator {
    controlsByCtid: IndexedDataSet<Control> = {};
    controls: IndexedDataSet<Control> = {};
    config: IEndpointCommunicatorConfig;
    indeterminateControls : { [idx: string] : boolean} = {};

    protected _connected: boolean = false;

    constructor() {
    }



    get endpoint_id() : string {
        return this.config.endpoint._id;
    }

    get connected() {
        return this._connected;
    }

    set connected(val: boolean) {
        this._connected = val;
    }


    connect() {
        this._connected = true;
    };

    disconnect() {
        this._connected = false;
    };



    setConfig(config: IEndpointCommunicatorConfig) {
        this.config = config;
    }

    getControlTemplates() : IndexedDataSet<Control> {
        return {};
    }

    /**
     * Process a ControlUpdate, likely by sending a command to
     * a device
     * @param request
     */
    handleControlUpdateRequest(request: ControlUpdateData) {
        throw new Error("handleControlUpdateRequest must be implemented by Communicator");
    }

    registerHyperlinkControl(config: any, name = "Device Web Interface", cmd = "hyperlink") {
        let ctid = this.endpoint_id + "-" + cmd;

        if (this.controlsByCtid[ctid]) {
            throw new Error(`duplicate ctid ${ctid} registered`);
        }

        this.controlsByCtid[ctid] = new Control(ctid, {
            _id : ctid,
            ctid: ctid,
            endpoint_id: this.endpoint_id,
            usertype: Control.USERTYPE_HYPERLINK,
            name: name,
            control_type: Control.CONTROL_TYPE_STRING,
            poll: 0,
            config: config,
            value: ""
        });

    }

    setControlValue(control: Control, val: any) {
        let valDiff = control.value != val;
        if (typeof val == 'object') {
            // Don't send update if nothing will change
            valDiff = JSON.stringify(control.value) != JSON.stringify(val);
        }

        if (valDiff || this.indeterminateControls[control._id]) {
            this.indeterminateControls[control._id] = false;

            debug(`control update: ${control.name} = ${val}`);
            this.config.controlUpdateCallback(control, val);
            control.value = val;
        }
    }

    setTemplates(controls: IndexedDataSet<Control>) {
        this.controls = controls;

        for (let id in controls) {
            let ctid = controls[id].ctid;
            let localControl = this.controlsByCtid[ctid];


            this.controlsByCtid[ctid] = controls[id];

            if (! localControl) {
                debug("setTemplates: No control located for ctid " + ctid);
            }
            else {
                // Set value of remote control to match local
                this.setControlValue(controls[id], localControl.value);
            }
        }
    }

}