import {DCSerializableData, DCSerializable} from "./DCSerializable";
import {Room} from "./Room";

export interface PanelData extends DCSerializableData {
    room_id: string;
    grouping: string;
    type: string;
    panel_index: number;
}

export class Panel extends DCSerializable {
    private _room: Room;
    room_id: string;
    grouping: string;
    type: string;
    panel_index: number;

    static tableStr = "panels";
    table: string;

    constructor(_id: string, data?: PanelData) {
        super(_id);
        this.table = Panel.tableStr;

        this.foreignKeys = [
            {
                type: Room,
                fkObjProp: "room",
                fkIdProp: "room_id",
                fkTable: Room.tableStr
            }
        ];

        this.requiredProperties = this.requiredProperties.concat([
            'room_id',
            'grouping',
            'type',
            'panel_index'
        ]);

        this.defaultProperties = {
            panel_index : "1"
        };

        if (data) {
            this.loadData(data);
        }
    }

    get room() : Room {
        return this._room;
    }

    set room(room: Room) {
        this._room = room;
        this.room_id = room._id;
    }

    getDataObject() : PanelData {
        return (<PanelData>DCSerializable.defaultDataObject(this));
    }
}