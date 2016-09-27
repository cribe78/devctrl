/**
 * The abstract DCSerializable class represents the basic unit of data interchange for the application.
 * DCSerializable objects correspond to MongoDB documents in the database.  Subtypes of the abstract class
 * correspond to collections in the database, and the application schema is defined in the subtype definitions.
 */



export interface IDCDataRequest {
    table: string;
    params: any;
}

export interface IDCDataUpdate {
    table: string,
    _id: string,
    "set": any
}

export interface DCSerializableData {
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
    referenced: { [index: string]  : DCSerializable };
    requiredProperties: string[] = [];
    optionalProperties: string[] = [];

    constructor(public _id: string) {
        this.dataLoaded = false;
        this.foreignKeys = [];
    };

    itemRequestData(): IDCDataRequest {
        return {
            table: this.table,
            params: {_id: this._id}
        };
    }

    loadData(data: DCSerializableData) {
        for (let prop of this.requiredProperties) {
            if (typeof data[prop] == 'undefined') {
                throw new Error("Invalid data object, " + prop + " must be defined");
            }

            this[prop] = data[prop];
        }

        for (let prop of this.optionalProperties) {
            this[prop] = data[prop];
        }

        this.dataLoaded = true;
    };


    abstract getDataObject() : DCSerializableData;
}