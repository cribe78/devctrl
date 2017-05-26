"use strict";
/*
DCDataModel

The data model shared by the various DevCtrl components

 */
Object.defineProperty(exports, "__esModule", { value: true });
var Panel_1 = require("./Panel");
var PanelControl_1 = require("./PanelControl");
var Room_1 = require("./Room");
var Endpoint_1 = require("./Endpoint");
var EndpointType_1 = require("./EndpointType");
var Control_1 = require("./Control");
var ActionTrigger_1 = require("./ActionTrigger");
var OptionSet_1 = require("./OptionSet");
var DCDataModel = (function () {
    function DCDataModel() {
        this.endpoints = {};
        this.endpoint_types = {};
        this.controls = {};
        this.panels = {};
        this.panel_controls = {};
        this.rooms = {};
        this.watcher_rules = {};
        this.option_sets = {};
        this.sortedArrays = {};
        this.types = {
            endpoints: Endpoint_1.Endpoint,
            endpoint_types: EndpointType_1.EndpointType,
            controls: Control_1.Control,
            option_sets: OptionSet_1.OptionSet,
            panels: Panel_1.Panel,
            panel_controls: PanelControl_1.PanelControl,
            rooms: Room_1.Room,
            watcher_rules: ActionTrigger_1.ActionTrigger,
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
            if (add.option_sets) {
                this.loadTableData(add.option_sets, this.option_sets, OptionSet_1.OptionSet);
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
            if (add.watcher_rules) {
                this.loadTableData(add.watcher_rules, this.watcher_rules, ActionTrigger_1.ActionTrigger);
            }
            // Call indexForeignKeys if relevant tables have been updated
            if (add.endpoints || add.endpoint_types) {
                this.indexForeignKeys(this.endpoints);
            }
            if (add.controls || add.control_templates || add.option_sets) {
                this.indexForeignKeys(this.controls);
            }
            if (add.panels || add.rooms) {
                this.indexForeignKeys(this.panels);
            }
            if (add.controls || add.panels || add.panel_controls) {
                this.indexForeignKeys(this.panel_controls);
            }
            if (add.controls || add.watcher_rules) {
                this.indexForeignKeys(this.watcher_rules);
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
                    if (deleteRec[fkDef.fkObjProp]) {
                        deleteRec[fkDef.fkObjProp].removeReference(deleteRec);
                    }
                }
                //Delete the object
                delete this[table][_id];
            }
        }
    };
    /**
     *  For data model objects that hold references to other data model objects,
     *  initialize those references
     *
     */
    DCDataModel.prototype.indexForeignKeys = function (objects) {
        for (var id in objects) {
            var obj = objects[id];
            for (var _i = 0, _a = obj.foreignKeys; _i < _a.length; _i++) {
                var fkDef = _a[_i];
                var fkObjs = this[fkDef.fkTable];
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
        var table = '';
        for (var id in newData) {
            if (modelData[id]) {
                modelData[id].loadData(newData[id]);
            }
            else {
                modelData[id] = new ctor(id, newData[id]);
            }
            if (!table) {
                table = modelData[id].table;
            }
        }
        if (table) {
            this.sortArrays(table);
        }
    };
    DCDataModel.prototype.getItem = function (id, table) {
        if (this[table][id]) {
            return this[table][id];
        }
        this[table][id] = new this.types[table](id);
        return this[table][id];
    };
    DCDataModel.prototype.getTableItem = function (id, table) {
        switch (table) {
            case Endpoint_1.Endpoint.tableStr:
                return this.getItem(id, table);
            case EndpointType_1.EndpointType.tableStr:
                return this.getItem(id, table);
            case Room_1.Room.tableStr:
                return this.getItem(id, table);
            case OptionSet_1.OptionSet.tableStr:
                return this.getItem(id, table);
            case Panel_1.Panel.tableStr:
                return this.getItem(id, table);
            case PanelControl_1.PanelControl.tableStr:
                return this.getItem(id, table);
            case Control_1.Control.tableStr:
                return this.getItem(id, table);
            case ActionTrigger_1.ActionTrigger.tableStr:
                return this.getItem(id, table);
        }
    };
    DCDataModel.prototype.sortArrays = function (table) {
        if (this.sortedArrays[table]) {
            for (var prop in this.sortedArrays[table]) {
                this.sortArray(table, prop);
            }
        }
    };
    DCDataModel.prototype.sortArray = function (table, sortProp) {
        if (this.sortedArrays[table] && this.sortedArrays[table][sortProp]) {
            this.sortedArrays[table][sortProp].length = 0;
            var keys = Object.keys(this[table]);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                this.sortedArrays[table][sortProp].push(this[table][key]);
            }
            this.sortedArrays[table][sortProp].sort(function (a, b) {
                if (a[sortProp] < b[sortProp]) {
                    return -1;
                }
                if (a[sortProp] > b[sortProp]) {
                    return 1;
                }
                return 0;
            });
        }
    };
    /**
     * sortedArray
     *
     * The data model maintains a set of sorted object arrays per request.  Return the
     * specified one
     * @param table
     * @param sortProp
     * @returns DCSerializable[]
     */
    DCDataModel.prototype.sortedArray = function (table, sortProp) {
        if (sortProp === void 0) { sortProp = '_id'; }
        if (!this.sortedArrays[table]) {
            this.sortedArrays[table] = {};
        }
        var sorted = this.sortedArrays[table][sortProp];
        if (sorted) {
            return sorted;
        }
        if (!this[table]) {
            throw new Error("Request for invalid table array");
        }
        this.sortedArrays[table][sortProp] = [];
        this.sortArray(table, sortProp);
        return this.sortedArrays[table][sortProp];
    };
    return DCDataModel;
}());
exports.DCDataModel = DCDataModel;
//# sourceMappingURL=DCDataModel.js.map