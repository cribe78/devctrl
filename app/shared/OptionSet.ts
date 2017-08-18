import {DCFieldType, DCSerializable, DCSerializableData} from "./DCSerializable";

export interface OptionSetData extends DCSerializableData {
    options : { [key: string] : string };
}

export class OptionSet extends DCSerializable {
    options : { [key: string] : string} = {};
    static tableStr = "option_sets";
    tableLabel = "Option Sets";

    constructor(_id: string, data?: OptionSetData) {
        super(_id);
        this.table = OptionSet.tableStr;

        this.fieldDefinitions = this.fieldDefinitions.concat([
            {
                name: 'options',
                type: DCFieldType.object,
                label: "Options",
                tooltip: "An object containing Option names and values"
            }
        ]);


        if (data) {
            this.loadData(data);
        }
    }

}