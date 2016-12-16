/**
 * The abstract DCSerializable class represents the basic unit of data interchange for the application.
 * DCSerializable objects correspond to MongoDB documents in the database.  Subtypes of the abstract class
 * correspond to collections in the database, and the application schema is defined in the subtype definitions.
 */
"use strict";
var DCSerializable = (function () {
    function DCSerializable(_id) {
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
    Object.defineProperty(DCSerializable.prototype, "name", {
        get: function () {
            if (typeof this._name !== 'undefined') {
                return this._name;
            }
            return "unknown " + this.table;
        },
        set: function (val) {
            this._name = val;
        },
        enumerable: true,
        configurable: true
    });
    DCSerializable.prototype.addReference = function (refObj) {
        if (!this.referenced[refObj.table]) {
            this.referenced[refObj.table] = {};
        }
        this.referenced[refObj.table][refObj._id] = refObj;
    };
    DCSerializable.prototype.fkSelectName = function () {
        return this.name;
    };
    DCSerializable.prototype.itemRequestData = function () {
        return {
            table: this.table,
            params: { _id: this._id }
        };
    };
    DCSerializable.prototype.loadData = function (data) {
        if (typeof data.name == 'undefined') {
            throw new Error("Name must be defined for " + this.table + "obj " + data._id);
        }
        this.name = data.name;
        for (var _i = 0, _a = this.requiredProperties; _i < _a.length; _i++) {
            var prop = _a[_i];
            if (typeof data[prop] == 'undefined') {
                throw new Error("Invalid " + this.table + " object, " + prop + " must be defined for " + this.name);
            }
            this[prop] = data[prop];
        }
        for (var _b = 0, _c = this.optionalProperties; _b < _c.length; _b++) {
            var prop = _c[_b];
            this[prop] = data[prop];
        }
        this.dataLoaded = true;
    };
    ;
    DCSerializable.prototype.objectPropertyName = function (idProperty) {
        for (var _i = 0, _a = this.foreignKeys; _i < _a.length; _i++) {
            var fkDef = _a[_i];
            if (fkDef.fkIdProp == idProperty) {
                return fkDef.fkObjProp;
            }
        }
        throw new Error("Failed to identify object property associated with " +
            idProperty + " for " + this.table);
    };
    DCSerializable.defaultDataObject = function (obj) {
        var data = { _id: obj._id, name: obj.name };
        for (var _i = 0, _a = obj.requiredProperties; _i < _a.length; _i++) {
            var prop = _a[_i];
            if (typeof obj[prop] !== 'undefined') {
                data[prop] = obj[prop];
            }
            else if (typeof obj.defaultProperties[prop] !== 'undefined') {
                data[prop] = obj.defaultProperties[prop];
            }
        }
        for (var _b = 0, _c = obj.optionalProperties; _b < _c.length; _b++) {
            var prop = _c[_b];
            if (typeof obj[prop] !== 'undefined') {
                data[prop] = obj[prop];
            }
        }
        return data;
    };
    DCSerializable.prototype.removeReference = function (refObj) {
        if (this.referenced[refObj.table] && this.referenced[refObj.table][refObj._id]) {
            delete this.referenced[refObj.table][refObj._id];
        }
    };
    return DCSerializable;
}());
exports.DCSerializable = DCSerializable;
//# sourceMappingURL=DCSerializable.js.map