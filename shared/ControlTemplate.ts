import { EndpointType } from "./EndpointType";
import {DevCtrlSerializableData, DCSerializable} from "./DCSerializable";

export interface ControlTemplateData extends DevCtrlSerializableData {
    endpoint_id: string;
    ctid: string;
    name: string;
    usertype: string;
    control_type: string;
    poll: number;
    config: any;
}


export class ControlTemplate extends DCSerializable {
    endpoint_id: string;
    ctid: string;
    name: string;
    usertype: string;
    control_type: string;
    poll: number;
    config: any;


    constructor(_id: string, data?: ControlTemplateData) {
        super(_id);

        if (data) {
            this.loadData(data);
        }
    }

    loadData(data: ControlTemplateData) {
        this.endpoint_id = data.endpoint_id;
        this.ctid = data.ctid;
        this.name = data.name;
        this.usertype = data.usertype;
        this.control_type = data.control_type;
        this.poll = data.poll;
        this.config = data.config;

        this.dataLoaded = true;
    }

    getDataObject() : ControlTemplateData {
        return {
            _id: this._id,
            endpoint_id: this.endpoint_id,
            ctid: this.ctid,
            name: this.name,
            usertype: this.usertype,
            control_type: this.control_type,
            poll: this.poll,
            config: this.config
        }
    }
}
