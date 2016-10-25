import {DCSerializable, DCSerializableData} from "./DCSerializable";
export type UpdateType = "device" | "user" | "watcher";
export type UpdateStatus = "requested" | "executed" | "observed";

export interface ControlUpdateData extends DCSerializableData {
    control_id : string;
    value: any;
    type: UpdateType;
    status: UpdateStatus;
    source: string;
    ephemeral?: boolean;
}

export class ControlUpdate extends DCSerializable {
    control_id : string;
    value: any;
    type: UpdateType;
    status: UpdateStatus;
    source: string;

    static tableStr = "ControlUpdates";

    constructor(_id: string, data?: ControlUpdateData ) {
        super(_id);
        this.table = ControlUpdate.tableStr;
        this.requiredProperties = [
            'control_id',
            'value',
            'type',
            'status',
            'source'
        ];

        if (data) {
            this.loadData(data);
        }

    }


    getDataObject() : ControlUpdateData {
        return (<ControlUpdateData>DCSerializable.defaultDataObject(this));
    }
}

