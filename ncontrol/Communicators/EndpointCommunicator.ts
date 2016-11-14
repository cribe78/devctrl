
import {Control} from "../shared/Control";
import {ControlUpdateData} from "../shared/ControlUpdate";
import {EndpointStatus, Endpoint} from "../shared/Endpoint";
import {IndexedDataSet} from "../shared/DCDataModel";


export interface IEndpointCommunicatorConfig {
    endpoint: Endpoint
    controlUpdateCallback: (control: Control, value: any) => void;
    statusUpdateCallback: (status: EndpointStatus) => void;
}


export class EndpointCommunicator {
    controlsByCtid: IndexedDataSet<Control> = {};
    controls: IndexedDataSet<Control> = {};
    config: IEndpointCommunicatorConfig;
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

    }

    setTemplates(controls: IndexedDataSet<Control>) {
        this.controls = controls;

        for (let id in controls) {
            this.controlsByCtid[controls[id].ctid] = controls[id];
        }
    }

}