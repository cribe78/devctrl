/**
 * Created by chris on 8/17/16.
 */

import {DCSerializable, DCSerializableData} from "./DCSerializable";
import {EndpointType} from "./EndpointType";

export enum EndpointStatus {
    Online,
    Disabled,
    Offline,
    Unknown
}


export interface EndpointData extends DCSerializableData {
    endpoint_type_id: string;
    status: EndpointStatus;
    name: string;
    ip: string;
    port: number;
}


export class Endpoint extends DCSerializable {
    private _type: EndpointType;
    endpoint_type_id: string;
    status: EndpointStatus;
    name: string;
    ip: string;
    port: number;

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

        this.requiredProperties = [
            'endpoint_type_id',
            'status',
            'name',
            'ip',
            'port'
        ];

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

    getDataObject() : EndpointData {
        return {
            _id: this._id,
            endpoint_type_id: this.endpoint_type_id,
            status: this.status,
            name: this.name,
            ip: this.ip,
            port: this.port
        }
    }
}