import {DCSerializableData, DCSerializable} from "./DCSerializable";

export interface RoomData extends DCSerializableData {
    name: string;
}


export class Room extends DCSerializable {
    static tableStr = "rooms";
    tableLabel = "Rooms";
    table: string;

    constructor(_id: string, data?: RoomData) {
        super(_id);
        this.table = Room.tableStr;

        this.referenced = {
            'panels' : {}
        };

        if (data) {
            this.loadData(data);
        }
    }

    getDataObject() : RoomData {
        return {
            _id: this._id,
            name: this.name
        }
    }

}