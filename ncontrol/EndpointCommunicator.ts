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
    templates: IndexedDataSet<ControlTemplate> = {};
    config: IEndpointCommunicatorConfig;

    constructor() {
    }

    connect() {};

    setConfig(config: IEndpointCommunicatorConfig) {
        this.config = config;
    }

    getControlTemplates() : IndexedDataSet<ControlTemplate> {
        return {};
    }

    setTemplates(templates: IndexedDataSet<ControlTemplate>) {
        this.templates = templates;

        for (let id in templates) {
            this.templatesByCtid[templates[id].ctid] = templates[id];
        }
    }


    static listCommunicators() {
        //for (let comm in communicators ) {
            //console.log("Comm: " + comm);
        //}


    }
}