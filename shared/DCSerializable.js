/**
 * The abstract DCSerializable class represents the basic unit of data interchange for the application.
 * DCSerializable objects correspond to MongoDB documents in the database.  Subtypes of the abstract class
 * correspond to collections in the database, and the application schema is defined in the subtype definitions.
 */
"use strict";
class DCSerializable {
    constructor(_id) {
        this._id = _id;
        this.requiredProperties = [];
        this.optionalProperties = [];
        this.defaultProperties = {};
        this.dataLoaded = false;
        this.foreignKeys = [];
        this.fields = this;
        this.referenced = {};
    }
    ;
    get name() {
        if (typeof this._name !== 'undefined') {
            return this._name;
        }
        return `unknown ${this.table}`;
    }
    set name(val) {
        this._name = val;
    }
    addReference(refObj) {
        if (!this.referenced[refObj.table]) {
            this.referenced[refObj.table] = {};
        }
        this.referenced[refObj.table][refObj._id] = refObj;
    }
    fkSelectName() {
        return this.name;
    }
    itemRequestData() {
        return {
            table: this.table,
            params: { _id: this._id }
        };
    }
    loadData(data) {
        if (typeof data.name == 'undefined') {
            throw new Error("Name must be defined for " + this.table + "obj " + data._id);
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
    }
    ;
    objectPropertyName(idProperty) {
        for (let fkDef of this.foreignKeys) {
            if (fkDef.fkIdProp == idProperty) {
                return fkDef.fkObjProp;
            }
        }
        throw new Error("Failed to identify object property associated with " +
            idProperty + " for " + this.table);
    }
    static defaultDataObject(obj) {
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
    removeReference(refObj) {
        if (this.referenced[refObj.table] && this.referenced[refObj.table][refObj._id]) {
            delete this.referenced[refObj.table][refObj._id];
        }
    }
}
exports.DCSerializable = DCSerializable;
//# sourceMappingURL=DCSerializable.js.map