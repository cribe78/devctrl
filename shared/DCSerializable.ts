/**
 * The abstract DCSerializable class represents the basic unit of data interchange for the application.
 * DCSerializable objects correspond to MongoDB documents in the database.  Subtypes of the abstract class
 * correspond to collections in the database, and the application schema is defined in the subtype definitions.
 */

export interface IDCDataDelete {
    table: string;
    _id: string;
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
    fields: DCSerializable;  // This is a hack while we work through all the references to "fields"
    foreignKeys: IDCForeignKeyDef[];
    referenced: {
        [index: string]  : {
            [index: string] : DCSerializable
        }
    };
    requiredProperties: string[] = [];
    optionalProperties: string[] = [];
    defaultProperties : {
        [index: string] : any
    } = {};

    constructor(public _id: string) {
        this.dataLoaded = false;
        this.foreignKeys = [];
        this.fields = this;
        this.referenced = {};
    };

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

    fkSelectName() {
        return this.name;
    }


    itemRequestData(): IDCDataRequest {
        return {
            table: this.table,
            params: {_id: this._id}
        };
    }

    loadData(data: DCSerializableData) {
        if (typeof data.name == 'undefined') {
            throw new Error("Name must be defined for " +this.table + "obj " + data._id);
        }
        this.name = data.name;

        for (let prop of this.requiredProperties) {
            if (typeof data[prop] == 'undefined') {
                throw new Error("Invalid " + this.table + " object, " + prop + " must be defined for " + this.name);
            }

            this[prop] = data[prop];
        }

        for (let prop of this.optionalProperties) {
            this[prop] = data[prop];
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


    abstract getDataObject() : DCSerializableData;

    static defaultDataObject(obj: DCSerializable) : DCSerializableData {
        let data = { _id: obj._id, name: obj.name };

        for (let prop of obj.requiredProperties) {
            if (typeof obj[prop] !== 'undefined') {
                data[prop] = obj[prop];
            }
            else if (typeof obj.defaultProperties[prop] !== 'undefined') {
                data[prop] = obj.defaultProperties[prop];
            }
        }

        for (let prop of obj.optionalProperties) {
            if (typeof obj[prop] !== 'undefined') {
                data[prop] = obj[prop];
            }
        }

        return data;
    }

    /**
     * For use as an the ngFor trackBy function
     */
    static trackById(idx : number, obj: DCSerializable) {
        return obj._id;
    }

    removeReference(refObj: DCSerializable) {
        if (this.referenced[refObj.table] && this.referenced[refObj.table][refObj._id]) {
            delete this.referenced[refObj.table][refObj._id];
        }
    }

 }