/**
 * The abstract DCSerializable class represents the basic unit of data interchange for the application.
 * DCSerializable objects correspond to MongoDB documents in the database.  Subtypes of the abstract class
 * correspond to collections in the database, and the application schema is defined in the subtype definitions.
 */
"use strict";
var DCSerializable = (function () {
    function DCSerializable(_id) {
        this._id = _id;
        this.requiredProperties = ['name'];
        this.optionalProperties = [];
        this.dataLoaded = false;
        this.foreignKeys = [];
        this.fields = this;
        this.referenced = {};
    }
    ;
    DCSerializable.prototype.addReference = function (refObj) {
        if (!this.referenced[refObj.table]) {
            this.referenced[refObj.table] = {};
        }
        this.referenced[refObj.table][refObj._id] = refObj;
    };
    DCSerializable.prototype.itemRequestData = function () {
        return {
            table: this.table,
            params: { _id: this._id }
        };
    };
    DCSerializable.prototype.loadData = function (data) {
        for (var _i = 0, _a = this.requiredProperties; _i < _a.length; _i++) {
            var prop = _a[_i];
            if (typeof data[prop] == 'undefined') {
                throw new Error("Invalid " + this.table + " object, " + prop + " must be defined for " + this._id);
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
    DCSerializable.defaultDataObject = function (obj) {
        var data = { _id: obj._id };
        for (var _i = 0, _a = obj.requiredProperties; _i < _a.length; _i++) {
            var prop = _a[_i];
            data[prop] = obj[prop];
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