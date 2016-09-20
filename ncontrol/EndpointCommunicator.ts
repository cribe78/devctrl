import {
    Endpoint,
    ControlTemplate,
    IndexedDataSet
} from "../shared/Shared";


export interface IEndpointCommunicatorConfig {
    endpoint: Endpoint
}


export class EndpointCommunicator {
    templatesByCtid: IndexedDataSet<ControlTemplate> = {};
    config: IEndpointCommunicatorConfig;

    constructor() {
    }

    connect() {};

    setConfig(config: IEndpointCommunicatorConfig) {
        this.config = config;
    }

    static listCommunicators() {
        //for (let comm in communicators ) {
            //console.log("Comm: " + comm);
        //}


    }
}