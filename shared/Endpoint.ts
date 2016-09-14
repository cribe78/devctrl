/**
 * Created by chris on 8/17/16.
 */

import {DCSerializable, DevCtrlSerializableData} from "./DCSerializable";
import {EndpointType} from "./EndpointType";

export enum EndpointStatus {
    Online,
    Disabled,
    Offline,
    Unknown
}


export interface EndpointData extends DevCtrlSerializableData {
    endpoint_type_id: string;
    status: EndpointStatus;
    name: string;
}


export class Endpoint extends DCSerializable {
    private _type: EndpointType;
    endpoint_type_id: string;
    status: EndpointStatus;
    name: string;
    static tableStr = "endpoints";
    table: string;
    static foreignKeys = [
        {
            type: EndpointType,
            fkObjProp: "type",
            fkIdProp: "endpoint_type_id",
            fkTable: EndpointType.tableStr
        }
    ];

    constructor(_id: string, data?: EndpointData) {
        super(_id);
        this.table = Endpoint.tableStr;

        if (data) {
            this.loadData(data);
        }
    }

    get type(): EndpointType {
        return this._type;
    }

    set type(newType: EndpointType) {
        this.endpoint_type_id = newType._id;
        this._type = newType;
    }

    loadData(data: EndpointData) {
        this.endpoint_type_id = data.endpoint_type_id;
        this.status = data.status;
        this.name = data.name;

        this.dataLoaded = true;
    }

    getDataObject() : EndpointData {
        return {
            _id: this._id,
            endpoint_type_id: this.endpoint_type_id,
            status: this.status,
            name: this.name
        }
    }
}