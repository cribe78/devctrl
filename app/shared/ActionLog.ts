import {DCSerializable, DCSerializableData} from "./DCSerializable";
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
    table = ActionLog.tableStr;

    constructor(_id: string, data?: ActionLogData) {
        super(_id);

        this.requiredProperties = this.requiredProperties.concat([
            'timestamp', 'referenceList', 'typeFlags', 'user_session_id'
        ]);

        if (data) {
            this.loadData(data);
        }
    }


    getDataObject() : ActionLogData {
        return DCSerializable.defaultDataObject(this) as ActionLogData;
    }
}