import {DCFieldType, DCSerializable, DCSerializableData, IDCFieldDefinition} from "./DCSerializable";

export interface EndpointTypeData extends DCSerializableData {
    communicatorClass: string;
}

export class EndpointType extends DCSerializable {
    communicatorClass: string;
    static tableStr = "endpoint_types";
    tableLabel = "Endpoint Types";

    ownFields : IDCFieldDefinition[] = [
        {
            name: "communicatorClass",
            type: DCFieldType.string,
            label: "Communicator Class",
            tooltip: "The path to the communicator class file"
        }
    ];

    constructor(_id: string, data?: EndpointTypeData) {
        super(_id);
        this.table = EndpointType.tableStr;

        this.referenced = {
            endpoints: {}
        };

        this.fieldDefinitions = this.fieldDefinitions.concat(this.ownFields);

        if (data) {
            this.loadData(data);
        }
    }
}