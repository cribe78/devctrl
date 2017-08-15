/**
 * Created by chris on 8/17/16.
 */

import {DCFieldType, DCSerializable, DCSerializableData} from "./DCSerializable";
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
    status: EndpointStatus = EndpointStatus.Offline;
    ip: string = "";
    port: number = 0;
    config: any = {};
    enabled: boolean = false;
    private _commLogOptions : string = "default";
    commLogOptionsObj : {};

    static tableStr = "endpoints";
    static tableLabel = "Endpoints";
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


        this.fieldDefinitions = this.fieldDefinitions.concat([
            {
                name: "endpoint_type_id",
                type: DCFieldType.fk,
                label: "Endpoint Type"
            },
            {
                name: "ip",
                type: DCFieldType.string,
                label: "Address"
            },
            {
                name: "port",
                type: DCFieldType.int,
                label: "Port"
            },
            {
                name: "config",
                type: DCFieldType.object,
                label: "Device Specific Config"
            },
            {
                name : "commLogOptions",
                type: DCFieldType.string,
                label: "Ncontrol Log Options"
            },
            {
                name: "status",
                type: DCFieldType.string,
                label: "Status",
                input_disabled: true
            },
            {
                name: "enabled",
                type: DCFieldType.bool,
                label: "Enabled?"
            }
        ]);


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