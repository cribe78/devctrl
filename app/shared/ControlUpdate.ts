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
            label: "Control",
            tooltip: "The updated control"
        },
        {
            name: "value",
            type: DCFieldType.any,
            label: "Value",
            tooltip: "The new control value"
        },
        {
            name: "type",
            type: DCFieldType.string,
            label: "Type",
            tooltip: "source type of update"
        },
        {
            name: "status",
            type: DCFieldType.string,
            label: "Status",
            tooltip: "Status up update"
        },
        {
            name: "source",
            type: DCFieldType.string,
            label: "Source",
            tooltip: "source id of update"

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

