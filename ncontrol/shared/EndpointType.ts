import {DCSerializable, DCSerializableData} from "./DCSerializable";

export interface EndpointTypeData extends DCSerializableData {
    name: string;
    communicatorClass: string;
}

export class EndpointType extends DCSerializable {
    name: string;
    communicatorClass: string;
    static tableStr = "endpoint_types";
    table: string;

    constructor(_id: string, data?: EndpointTypeData) {
        super(_id);
        this.table = EndpointType.tableStr;

        this.requiredProperties = [
            'communicatorClass',
            'name'
        ];

        if (data) {
            this.loadData(data);
        }
    }

    getDataObject() : EndpointTypeData {
        return {
            _id: this._id,
            name: this.name,
            communicatorClass: this.communicatorClass
        }
    }
}