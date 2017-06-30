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
    commLogOptions: string;
}


export class Endpoint extends DCSerializable {
    private _type: EndpointType;
    endpoint_type_id: string;
    status: EndpointStatus;
    ip: string;
    port: number;
    enabled: boolean;
    private _commLogOptions : string;
    commLogOptionsObj : {}

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

        this.referenced = {
            'controls' : {}
        };

        this.requiredProperties = this.requiredProperties.concat([
            'endpoint_type_id',
            'status',
            'ip',
            'port',
            'enabled',
            'commLogOptions'
        ]);

        this.defaultProperties = {
            status : EndpointStatus.Offline,
            ip : "",
            port : 0,
            enabled : false,
            commLogOptions : "default"
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

    get commLogOptions() {
        return this._commLogOptions;
    }

    set commLogOptions(val) {
        this._commLogOptions = val;

        let optionsList = val.split(",");
        this.commLogOptionsObj = {};

        for( let opt of optionsList) {
            this.commLogOptionsObj[opt] = true;
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
        return (<EndpointData>DCSerializable.defaultDataObject(this));
    }
}