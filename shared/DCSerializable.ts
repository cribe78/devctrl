/**
 * The abstract DCSerializable class represents the basic unit of data interchange for the application.
 * DCSerializable objects correspond to MongoDB documents in the database.  Subtypes of the abstract class
 * correspond to collections in the database, and the application schema is defined in the subtype definitions.
 */



export interface DevCtrlSerializableData {
    _id: string
}


export interface IDCForeignKeyDef {
    type: any, // The class of the fk object
    fkObjProp: string,  // Name of the property holding the object
    fkIdProp: string, // Name of the property holding the object id
    fkTable: string // Name of foreign table
}

export abstract class DCSerializable {
    dataLoaded: boolean;
    table : string;
    foreignKeys: IDCForeignKeyDef[];

    constructor(public _id: string) {
        this.dataLoaded = false;
        this.foreignKeys = [];
    };

    itemRequestData() {
        let reqData = {
            table: this.table,
            params: {_id: this._id}
        };

        return reqData;
    }



    abstract loadData(data: DevCtrlSerializableData);
    abstract getDataObject() : DevCtrlSerializableData;
}