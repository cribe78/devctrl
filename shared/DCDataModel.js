/*
DCDataModel

The data model shared by the various DevCtrl components

 */
"use strict";
const Panel_1 = require("./Panel");
const PanelControl_1 = require("./PanelControl");
const Room_1 = require("./Room");
const Endpoint_1 = require("./Endpoint");
const EndpointType_1 = require("./EndpointType");
const Control_1 = require("./Control");
const WatcherRule_1 = require("./WatcherRule");
const OptionSet_1 = require("./OptionSet");
class DCDataModel {
    constructor() {
        this.endpoints = {};
        this.endpoint_types = {};
        this.controls = {};
        this.panels = {};
        this.panel_controls = {};
        this.rooms = {};
        this.watcher_rules = {};
        this.option_sets = {};
        this.types = {
            endpoints: Endpoint_1.Endpoint,
            endpoint_types: EndpointType_1.EndpointType,
            controls: Control_1.Control,
            option_sets: OptionSet_1.OptionSet,
            panels: Panel_1.Panel,
            panel_controls: PanelControl_1.PanelControl,
            rooms: Room_1.Room,
            watcher_rules: WatcherRule_1.WatcherRule,
        };
        this.debug = console.log;
    }
    ;
    loadData(data) {
        if (data.add) {
            let add = data.add;
            let addTables = [];
            for (let t in add) {
                addTables.push(t);
            }
            let tableStr = addTables.join(", ");
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
                this.loadTableData(add.watcher_rules, this.watcher_rules, WatcherRule_1.WatcherRule);
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
            let del = data.delete;
            let table = del.table;
            let _id = del._id;
            // Remove references from foreign key objects
            if (this[table][_id]) {
                let deleteRec = this[table][_id];
                for (let fkDef of deleteRec.foreignKeys) {
                    if (deleteRec[fkDef.fkObjProp]) {
                        deleteRec[fkDef.fkObjProp].removeReference(deleteRec);
                    }
                }
                //Delete the object
                delete this[table][_id];
            }
        }
    }
    /**
     *  For data model objects that hold references to other data model objects,
     *  initialize those references
     *
     */
    indexForeignKeys(objects) {
        for (let id in objects) {
            let obj = objects[id];
            for (let fkDef of obj.foreignKeys) {
                let fkObjs = this[fkDef.fkTable];
                if (obj[fkDef.fkIdProp]) {
                    let fkId = obj[fkDef.fkIdProp]; // The the foreign key id value
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
    }
    loadTableData(newData, modelData, ctor) {
        for (let id in newData) {
            if (modelData[id]) {
                modelData[id].loadData(newData[id]);
            }
            else {
                modelData[id] = new ctor(id, newData[id]);
            }
        }
    }
    getItem(id, table) {
        if (this[table][id]) {
            return this[table][id];
        }
        this[table][id] = new this.types[table](id);
        return this[table][id];
    }
    getTableItem(id, table) {
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
            case WatcherRule_1.WatcherRule.tableStr:
                return this.getItem(id, table);
        }
    }
}
exports.DCDataModel = DCDataModel;
//# sourceMappingURL=DCDataModel.js.map