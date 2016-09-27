import {
    Endpoint,
    IndexedDataSet
} from "../shared/Shared";
import {Control} from "../shared/Control";
import {ControlUpdateData} from "../shared/ControlUpdate";


export interface IEndpointCommunicatorConfig {
    endpoint: Endpoint
    controlUpdateCallback: (control: Control, value: any) => void;
}


export class EndpointCommunicator {
    controlsByCtid: IndexedDataSet<Control> = {};
    controls: IndexedDataSet<Control> = {};
    config: IEndpointCommunicatorConfig;

    constructor() {
    }

    connect() {};

    setConfig(config: IEndpointCommunicatorConfig) {
        this.config = config;
    }

    getControlTemplates() : IndexedDataSet<Control> {
        return {};
    }

    handleControlUpdateRequest(request: ControlUpdateData) {

    }

    setTemplates(controls: IndexedDataSet<Control>) {
        this.controls = controls;

        for (let id in controls) {
            this.controlsByCtid[controls[id].ctid] = controls[id];
        }
    }


    static listCommunicators() {
        //for (let comm in communicators ) {
            //console.log("Comm: " + comm);
        //}


    }
}