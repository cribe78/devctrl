/*
DCDataModel

The data model shared by the various DevCtrl components

 */
"use strict";
var Panel_1 = require("./Panel");
var PanelControl_1 = require("./PanelControl");
var Room_1 = require("./Room");
var Endpoint_1 = require("./Endpoint");
var EndpointType_1 = require("./EndpointType");
var Control_1 = require("./Control");
var DCDataModel = (function () {
    function DCDataModel() {
        this.endpoints = {};
        this.endpoint_types = {};
        this.controls = {};
        this.panels = {};
        this.panel_controls = {};
        this.rooms = {};
        this.types = {
            endpoints: Endpoint_1.Endpoint,
            endpoint_type: EndpointType_1.EndpointType,
            controls: Control_1.Control,
            panels: Panel_1.Panel,
            panel_controls: PanelControl_1.PanelControl,
            rooms: Room_1.Room
        };
        this.debug = console.log;
    }
    ;
    DCDataModel.prototype.loadData = function (data) {
        if (data.add) {
            var add = data.add;
            var addTables = [];
            for (var t in add) {
                addTables.push(t);
            }
            var tableStr = addTables.join(", ");
            this.debug("loadData from " + tableStr);
            // There is some boilerplate here that is necessary to allow typescript
            // to perform its type checking magic.
            if (add.endpoint_types) {
                this.loadTableData(add.endpoint_types, this.endpoint_types, EndpointType_1.EndpointType);
            }
            if (add.endpoints) {
                this.loadTableData(add.endpoints, this.endpoints, Endpoint_1.Endpoint);
            }
            if (add.controls) {
                this.loadTableData(add.controls, this.controls, Control_1.Control);
            }
            if (add.panels) {
                this.loadTableData(add.panels, this.panels, Panel_1.Panel);
            }
            if (add.panel_controls) {
                this.loadTableData(add.panel_controls, this.panel_controls, PanelControl_1.PanelControl);
            }
            if (add.rooms) {
                this.loadTableData(add.rooms, this.rooms, Room_1.Room);
            }
            // Call indexForeignKeys if relevant tables have been updated
            if (add.endpoints || add.endpoint_types) {
                this.indexForeignKeys(this.endpoints, Endpoint_1.Endpoint.foreignKeys);
            }
            if (add.controls || add.control_templates) {
                this.indexForeignKeys(this.controls, Control_1.Control.foreignKeys);
            }
            if (add.panels || add.rooms) {
                this.indexForeignKeys(this.panels, Panel_1.Panel.foreignKeys);
            }
            if (add.controls || add.panels || add.panel_controls) {
                this.indexForeignKeys(this.panel_controls, PanelControl_1.PanelControl.foreignKeys);
            }
        }
        if (data.delete) {
            var del = data.delete;
            var table = del.table;
            var _id = del._id;
            // Remove references from foreign key objects
            if (this[table][_id]) {
                var deleteRec = this[table][_id];
                for (var _i = 0, _a = deleteRec.foreignKeys; _i < _a.length; _i++) {
                    var fkDef = _a[_i];
                    deleteRec[fkDef.fkObjProp].removeReference(deleteRec);
                }
            }
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
                    // Set reference on foreign object
                    fkObjs[fkId].addReference(obj);
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