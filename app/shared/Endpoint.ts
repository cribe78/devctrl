/**
 * Created by chris on 8/17/16.
 */

import {DCFieldType, DCSerializable, DCSerializableData} from "./DCSerializable";
import {EndpointType} from "./EndpointType";
import {Room} from "./Room";
import {IndexedDataSet} from "./DCDataModel";
import {Control} from "./Control";

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
    private _room: Room;
    endpoint_type_id: string;
    room_id : string;
    status: EndpointStatus = EndpointStatus.Offline;
    ip: string = "";
    port: number = 0;
    config: any = {};
    enabled: boolean = false;
    private _commLogOptions : string = "default";
    commLogOptionsObj : {};

    static tableStr = "endpoints";
    tableLabel = "Endpoints";
    foreignKeys = [
        {
            type: EndpointType,
            fkObjProp: "type",
            fkIdProp: "endpoint_type_id",
            fkTable: EndpointType.tableStr
        },
        {
            type: Room,
            fkObjProp: "room",
            fkIdProp: "room_id",
            fkTable: Room.tableStr
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
                label: "Endpoint Type",
                tooltip: "Determines the control protocol used for device communication"
            },
            {
                name: "ip",
                type: DCFieldType.string,
                label: "Address",
                tooltip: "The IP or device address"
            },
            {
                name: "port",
                type: DCFieldType.int,
                label: "Port",
                tooltip: "The TCP port number for a networked device"
            },
            {
                name: "config",
                type: DCFieldType.object,
                label: "Device Specific Config",
                tooltip: "A collection on device specific config options"
            },
            {
                name : "commLogOptions",
                type: DCFieldType.string,
                label: "Ncontrol Log Options",
                tooltip: "comma seperated list.  options include: polling, matching, rawData, connection, updates"
            },
            {
                name: "status",
                type: DCFieldType.string,
                label: "Status",
                inputDisabled: true,
                tooltip: "The current communications status of the Endpoint"
            },
            {
                name: "enabled",
                type: DCFieldType.bool,
                label: "Enabled?",
                tooltip: "Disable to prevent connection attempts to the Endpoint"
            },
            {
                name: "room_id",
                type: DCFieldType.fk,
                label: "Room",
                tooltip: "Assign this endpoint to room for navigation purposes",
                optional: true
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

    get room() : Room {
        return this._room;
    }

    set room(newRoom : Room) {
        this.room_id = newRoom._id;
        this._room = newRoom;
    }

    get type(): EndpointType {
        return this._type;
    }

    set type(newType: EndpointType) {
        this.endpoint_type_id = newType._id;
        this._type = newType;
    }

    getControlByCtid(ctid: string) {
        let myControls = <IndexedDataSet<Control>>this.referenced.controls;
        let controlId =  Object.keys(myControls).find( id => {
                return myControls[id].ctid == this._id + "-" + ctid || myControls[id].ctid == ctid;
            });

        return this.referenced.controls[controlId];

    }

    getDataObject() : EndpointData {
        return (<EndpointData>DCSerializable.defaultDataObject(this));
    }
}