/**
 * The abstract DCSerializable class represents the basic unit of data interchange for the application.
 * DCSerializable objects correspond to MongoDB documents in the database.  Subtypes of the abstract class
 * correspond to collections in the database, and the application schema is defined in the subtype definitions.
 */
"use strict";
var DCSerializable = (function () {
    function DCSerializable(_id) {
        this._id = _id;
        this.dataLoaded = false;
        this.foreignKeys = [];
    }
    ;
    DCSerializable.prototype.itemRequestData = function () {
        var reqData = {
            table: this.table,
            params: { _id: this._id }
        };
        return reqData;
    };
    return DCSerializable;
}());
exports.DCSerializable = DCSerializable;
//# sourceMappingURL=DCSerializable.js.map