/**
 * The abstract DCSerializable class represents the basic unit of data interchange for the application.
 * DCSerializable objects correspond to MongoDB documents in the database.  Subtypes of the abstract class
 * correspond to collections in the database, and the application schema is defined in the subtype definitions.
 */

export interface IDCDataAdd {
    [index: string] : DCSerializableData[]
}


export interface IDCDataDelete {
    table: string;
    _id: string;
}

export interface IDCDataExchange {
    add?: {
        [index: string] : {
            [index: string] : DCSerializableData
        }
    },
    delete?: IDCDataDelete,
    error?: string
}

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
    _id: string,
    name: string
}

export enum DCFieldType {
    string = "string",
    int = "int",
    bool = "bool",
    selectStatic = "select-static",
    fk = "fk",
    object = "object",
    watcherActionValue = "watcher-action-value",
    any = "any"
}

// The IDCFieldDefinition provides type information used by the application front end and DataModel
export interface IDCFieldDefinition {
    name: string;
    type: DCFieldType;
    optional?: boolean;
    label: string;
    options?: {
        name : string;
        value : string;
    }[],
    inputDisabled?: boolean;
    tooltip: string;
}


export interface IDCTableDefinition {
    name: string,
    label: string
    fields: IDCFieldDefinition[];
    foreignKeys: IDCForeignKeyDef[];
}

export interface IDCForeignKeyDef {
    type: any, // The class of the fk object
    fkObjProp: string,  // Name of the property holding the object
    fkIdProp: string, // Name of the property holding the object id
    fkTable: string // Name of foreign table
}


export abstract class DCSerializable {
    _name: string;
    dataLoaded: boolean;
    table : string;
    tableLabel : string = "Table";
    foreignKeys: IDCForeignKeyDef[] = [];
    referenced: {
        [index: string]  : {
            [index: string] : DCSerializable
        }
    };
    fieldDefinitions : IDCFieldDefinition[] = [{
        name: "name",
        type: DCFieldType.string,
        label: "Name",
        tooltip: "The Name of this object"
    }];

    constructor(public _id: string) {
        this.dataLoaded = false;
        this.foreignKeys = [];
        this.referenced = {};
    };

    get id() {
        return this._id;
    }

    get name() {
        if (typeof this._name !== 'undefined') {
            return this._name;
        }

        return `unknown ${this.table}`;
    }

    set name(val) {
        this._name = val;
    }

    addReference(refObj: DCSerializable) {
        if (! this.referenced[refObj.table]) {
            this.referenced[refObj.table] = {};
        }

        this.referenced[refObj.table][refObj._id] = refObj;
    }


    static defaultDataObject(obj: DCSerializable) : DCSerializableData {
        let data = { _id: obj._id, name: obj.name };

        for (let field of obj.fieldDefinitions) {
            if (typeof obj[field.name] !== 'undefined') {
                data[field.name] = obj[field.name];
            }
        }

        return data;
    }

    equals(obj: DCSerializable) {
        return obj && obj._id == this._id;
    }

    fkSelectName() {
        return this.name;
    }

    getDataObject() : DCSerializableData {
        return DCSerializable.defaultDataObject(this);
    };


    itemRequestData(): IDCDataRequest {
        return {
            table: this.table,
            params: {_id: this._id}
        };
    }

    loadData(data: DCSerializableData) {
        for (let field of this.fieldDefinitions) {
            if (typeof data[field.name] == 'undefined') {
                if (field.optional) {
                    continue;
                }

                throw new Error("Invalid " + this.table + " object, " + field.name + " must be defined for " + this.id);
            }

            this[field.name] = data[field.name];
        }

        this.dataLoaded = true;
    };


    objectPropertyName(idProperty: string) {
        for (let fkDef of this.foreignKeys) {
            if (fkDef.fkIdProp == idProperty) {
                return fkDef.fkObjProp;
            }
        }

        throw new Error("Failed to identify object property associated with " +
            idProperty + " for " + this.table);
    }

    removeReference(refObj: DCSerializable) {
        if (this.referenced[refObj.table] && this.referenced[refObj.table][refObj._id]) {
            delete this.referenced[refObj.table][refObj._id];
        }
    }


    tableDefinition() : IDCTableDefinition {
        return {
            name: this.table,
            label: this.tableLabel,
            fields: this.fieldDefinitions,
            foreignKeys: this.foreignKeys
        }
    }

    static typeTableDefinition(ctor : { new(id) : DCSerializable}) : IDCTableDefinition {
        let obj = new ctor("0");

        return obj.tableDefinition();
    }



    /**
     * For use as an the ngFor trackBy function
     */
    static trackById(idx : number, obj: DCSerializable) {
        return obj._id;
    }

 }