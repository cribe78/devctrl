/*
DCDataModel

The data model shared by the various DevCtrl components

 */
"use strict";
var Shared_1 = require("./Shared");
var DCDataModel = (function () {
    function DCDataModel() {
        this.endpoints = {};
        this.endpoint_types = {};
        this.controls = {};
        this.types = {
            endpoints: Shared_1.Endpoint,
            endpoint_type: Shared_1.EndpointType,
            controls: Shared_1.Control
        };
    }
    ;
    DCDataModel.prototype.loadData = function (data) {
        if (data.add) {
            var add = data.add;
            if (add.endpoint_types) {
                this.loadTableData(add.endpoint_types, this.endpoint_types, Shared_1.EndpointType);
            }
            if (add.endpoints) {
                this.loadTableData(add.endpoints, this.endpoints, Shared_1.Endpoint);
            }
            if (add.controls) {
                this.loadTableData(data.add.endpoints, this.endpoints, Shared_1.Endpoint);
            }
            this.indexForeignKeys(this.endpoints, Shared_1.Endpoint.foreignKeys);
        }
    };
    /**
     *  For data model objects that hold references to other data model objects,
     *  initialize those references
     *
     *  TODO: set up "referenced" array
     */
    DCDataModel.prototype.indexForeignKeys = function (objects, fks) {
        for (var _i = 0, fks_1 = fks; _i < fks_1.length; _i++) {
            var fkDef = fks_1[_i];
            var fkObjs = this[fkDef.fkTable];
            for (var id in objects) {
                var obj = objects[id];
                if (obj[fkDef.fkIdProp]) {
                    var fkId = obj[fkDef.fkIdProp]; // The the foreign key id value
                    if (!fkObjs[fkId]) {
                        // Create a new object if necessary
                        fkObjs[fkId] = new fkDef.type(fkId);
                    }
                    // Set reference to "foreign" object
                    obj[fkDef.fkObjProp] = fkObjs[fkId];
                }
            }
        }
    };
    DCDataModel.prototype.loadTableData = function (newData, modelData, ctor) {
        for (var id in newData) {
            if (modelData[id]) {
                modelData[id].loadData(newData[id]);
            }
            else {
                modelData[id] = new ctor(id, newData[id]);
            }
        }
    };
    DCDataModel.prototype.getItem = function (id, table) {
        if (this[table][id]) {
            return this[table][id];
        }
        this[table][id] = new this.types[table](id);
        return this[table][id];
    };
    return DCDataModel;
}());
exports.DCDataModel = DCDataModel;
//# sourceMappingURL=DCDataModel.js.map