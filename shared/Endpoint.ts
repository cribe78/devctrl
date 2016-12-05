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
    ip: string;
    port: number;
    enabled: boolean;
}


export class Endpoint extends DCSerializable {
    private _type: EndpointType;
    endpoint_type_id: string;
    status: EndpointStatus;
    ip: string;
    port: number;
    enabled: boolean;

    static tableStr = "endpoints";
    table: string;
    foreignKeys = [
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

        this.requiredProperties = this.requiredProperties.concat([
            'endpoint_type_id',
            'status',
            'ip',
            'port',
            'enabled'
        ]);

        this.defaultProperties = {
            status : EndpointStatus.Offline,
            ip : "",
            port : 0,
            enabled : false
        };

        if (data) {
            this.loadData(data);
        }
    }

    get address() : string {
        return this.ip;
    }

    set address(address: string) {
        this.ip = address;
    }

    get type(): EndpointType {
        return this._type;
    }

    set type(newType: EndpointType) {
        this.endpoint_type_id = newType._id;
        this._type = newType;
    }

    getDataObject() : EndpointData {
        return (<EndpointData>DCSerializable.defaultDataObject(this));
    }
}