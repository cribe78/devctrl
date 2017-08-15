import {DCSerializableData, DCSerializable, IDCFieldDefinition, DCFieldType} from "./DCSerializable";
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
    type: string = "list";
    panel_index: number = 1;

    static tableStr = "panels";
    static tableLabel = "Panels"
    table: string;

    foreignKeys = [
        {
            type: Room,
            fkObjProp: "room",
            fkIdProp: "room_id",
            fkTable: Room.tableStr
        }
    ];

    ownFields : IDCFieldDefinition[] = [
        {
            name: "room_id",
            type: DCFieldType.fk,
            label: "Room"
        },
        {
            name: "grouping",
            type: DCFieldType.string,
            label: "Subgroup"
        },
        {
            name: "type",
            type: DCFieldType.selectStatic,
            label: "Type",
            options: [
                { name: "List", value: "list"},
                { name: "Switch Group", value: "switch-group"},
                { name: "Horizontal", value: "horizontal"}
            ]
        },
        {
            name: "panel_index",
            type: DCFieldType.int,
            label: "Order"
        }
    ];

    constructor(_id: string, data?: PanelData) {
        super(_id);
        this.table = Panel.tableStr;

        this.referenced = {
            'panel_controls' : {}
        };

        this.fieldDefinitions = this.fieldDefinitions.concat(this.ownFields);

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

    fkSelectName() {
        return `${this.room.name}: ${this.grouping}: ${this.name}`;
    }
}