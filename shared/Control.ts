/**
 *
 * The Control is the basic unit of the DevCtrl application.  A Control represents and individual setting or value
 * on a device (Endpoint).  The frontend provides an interface for users to view and change the values of controls.
 */

import {DCSerializableData, DCSerializable} from "./DCSerializable";
import {Endpoint} from "./Endpoint";

export interface ControlData extends DCSerializableData{
    endpoint_id: string;
    ctid: string;
    name: string;
    usertype: string;
    control_type: string;
    poll: number;
    config: any;
    value: any;
}


export class Control extends DCSerializable {
    endpoint_id: string;
    endpoint: Endpoint;
    ctid: string;
    name: string;
    usertype: string;
    control_type: string;
    poll: number;
    config: any;
    value: any;

    static tableStr = "controls";
    table: string;

    static foreignKeys = [
        {
            type: Endpoint,
            fkObjProp: "endpoint",
            fkIdProp: "endpoint_id",
            fkTable: Endpoint.tableStr
        }
    ];

    constructor(_id: string, data?: ControlData) {
        super(_id);
        this.table = Control.tableStr;
        this.requiredProperties = [
            'endpoint_id',
            'ctid',
            'name',
            'usertype',
            'control_type',
            'poll',
            'config',
            'value'
        ];


        if (data) {
            this.loadData(data);
        }
    }


    getDataObject() : ControlData {
        return {
            _id: this._id,
            endpoint_id: this.endpoint_id,
            ctid: this.ctid,
            name: this.name,
            usertype: this.usertype,
            control_type: this.control_type,
            poll: this.poll,
            config: this.config,
            value: this.value
        }
    }
}


