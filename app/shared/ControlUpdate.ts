import {
    DCFieldType, DCSerializable, DCSerializableData, IDCFieldDefinition,
    IDCTableDefinition
} from "./DCSerializable";
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
    tableLabel = "Control Updates";

    ownFields : IDCFieldDefinition[] = [
        {
            name: 'control_id',
            type: DCFieldType.fk,
            label: "Control"
        },
        {
            name: "value",
            type: DCFieldType.any,
            label: "Value"
        },
        {
            name: "type",
            type: DCFieldType.string,
            label: "Type"
        },
        {
            name: "status",
            type: DCFieldType.string,
            label: "Status"
        },
        {
            name: "source",
            type: DCFieldType.string,
            label: "Source"
        }
    ];

    constructor(_id: string, data?: ControlUpdateData ) {
        super(_id);
        this.table = ControlUpdate.tableStr;
        this.fieldDefinitions = this.fieldDefinitions.concat(this.ownFields);

        if (data) {
            this.loadData(data);
        }

    }


    getDataObject() : ControlUpdateData {
        return (<ControlUpdateData>DCSerializable.defaultDataObject(this));
    }
}

