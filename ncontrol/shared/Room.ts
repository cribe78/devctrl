import {DCSerializableData, DCSerializable} from "./DCSerializable";

export interface RoomData extends DCSerializableData {
    name: string;
}

export class Room extends DCSerializable {
    name: string;

    static tableStr = "rooms";
    table: string;

    constructor(_id: string, data?: RoomData) {
        super(_id);
        this.table = Room.tableStr;

        this.requiredProperties = ['name'];

        if (data) {
            this.loadData;
        }
    }

    getDataObject() : RoomData {
        return {
            _id: this._id,
            name: this.name
        }
    }

}