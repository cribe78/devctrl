import { EndpointType } from "./EndpointType";
import {DCSerializableData, DCSerializable} from "./DCSerializable";
import {Endpoint} from "./Endpoint";
import {IndexedDataSet} from "./DCDataModel";

export interface ControlTemplateData extends DCSerializableData {
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
    endpoint: Endpoint;
    ctid: string;
    name: string;
    usertype: string;
    control_type: string;
    poll: number;
    config: any;

    static tableStr = "control_templates";
    table: string;

    static foreignKeys = [
        {
            type: Endpoint,
            fkObjProp: "endpoint",
            fkIdProp: "endpoint_id",
            fkTable: Endpoint.tableStr
        }
    ];

    constructor(_id: string, data?: ControlTemplateData) {
        super(_id);
        this.table = ControlTemplate.tableStr;
        this.requiredProperties = [
            'endpoint_id',
            'ctid',
            'name',
            'usertype',
            'control_type',
            'poll',
            'config'
        ];


        if (data) {
            this.loadData(data);
        }
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
