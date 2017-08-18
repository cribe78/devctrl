import {DCFieldType, DCSerializable, DCSerializableData, IDCFieldDefinition} from "./DCSerializable";
import {UserSession} from "./UserSession";


export interface ActionLogData extends DCSerializableData {
    timestamp : number;
    referenceList : string[];
    typeFlags: string[],
    user_session_id: string
}

export class ActionLog extends DCSerializable {
    timestamp: number;
    referenceList : string[] = [];
    typeFlags : string[] = [];
    user_session_id : string;

    static tableStr = "ActionLogs";
    static tableLabel = "Action Logs";
    table = ActionLog.tableStr;

    ownFields : IDCFieldDefinition[] = [
        {
            name: "control_id",
            type: DCFieldType.fk,
            label: "Control",
            tooltip: "The affected Control"
        },
        {
            name: "client_id",
            type: DCFieldType.string,
            label: "Client",
            tooltip: "The client requesting the action"
        },
        {
            name: "new_value",
            type: DCFieldType.string,
            label: "New Value",
            tooltip: "The new Control value"
        },
        {
            name: "old_value",
            type: DCFieldType.string,
            label: "Old Value",
            tooltip: "The old Control value"
        },
        {
            name: "ts",
            type: DCFieldType.int,
            label: "Timestamp",
            tooltip: "The time of the action"
        }
    ]

    constructor(_id: string, data?: ActionLogData) {
        super(_id);

        this.fieldDefinitions = this.fieldDefinitions.concat(this.ownFields);

        if (data) {
            this.loadData(data);
        }
    }


    getDataObject() : ActionLogData {
        return DCSerializable.defaultDataObject(this) as ActionLogData;
    }
}