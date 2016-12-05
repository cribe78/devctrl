import {DCSerializable, DCSerializableData} from "./DCSerializable";

export interface OptionSetData extends DCSerializableData {
    options : { [key: string] : string };
}

export class OptionSet extends DCSerializable {
    options : { [key: string] : string};
    static tableStr = "option_sets";

    constructor(_id: string, data?: OptionSetData) {
        super(_id);
        this.table = OptionSet.tableStr;

        this.requiredProperties = this.requiredProperties.concat([
            'options'
        ]);

        if (data) {
            this.loadData(data);
        }
    }


    getDataObject() : OptionSetData {
        return (<OptionSetData>DCSerializable.defaultDataObject(this));
    }
}