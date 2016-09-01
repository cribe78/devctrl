import { ControlValue } from "./ControlValue";
import { Control } from "./Control";


export enum CommandType {
    Query,
    Execute,
    Set
}

export enum CommandStatus {
    Queued,
    Executed,
    Error
}

export interface CommandData {
    newValue: ControlValue;
    controlId: string;
    status: CommandStatus;
    type: CommandType;

}


export class Command {
    data: CommandData;
    control: Control;

    constructor(data: CommandData) {
        this.data = data;
    }
}