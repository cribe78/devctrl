import {DCSerializable, DevCtrlSerializableData} from "./DCSerializable";

export interface EndpointTypeData extends DevCtrlSerializableData {
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

        if (data) {
            this.loadData(data);
        }
    }

    loadData(data: EndpointTypeData) {
        this.communicatorClass = data.communicatorClass;
        this.name = data.name;

        this.dataLoaded = true;
    }

    getDataObject() : EndpointTypeData {
        return {
            _id: this._id,
            name: this.name,
            communicatorClass: this.communicatorClass
        }
    }
}