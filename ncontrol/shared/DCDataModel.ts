/*
DCDataModel

The data model shared by the various DevCtrl components

 */


import {Panel, PanelData} from "./Panel";
import {PanelControl, PanelControlData} from "./PanelControl";
import {Room, RoomData} from "./Room";
import {Endpoint, EndpointData} from "./Endpoint";
import {EndpointType, EndpointTypeData} from "./EndpointType";
import {Control, ControlData} from "./Control";
import {DCSerializable, IDCForeignKeyDef, DCSerializableData, IDCDataDelete} from "./DCSerializable";
import {WatcherRule, WatcherRuleData} from "./WatcherRule";
import {OptionSet, OptionSetData} from "./OptionSet";


export interface IndexedDataSet<T> {
    [index: string] : T;
}

export class DCDataModel {
    endpoints : IndexedDataSet<Endpoint> = {};
    endpoint_types : IndexedDataSet<EndpointType> = {};
    controls : IndexedDataSet<Control> = {};
    panels: IndexedDataSet<Panel> = {};
    panel_controls: IndexedDataSet<PanelControl> = {};
    rooms: IndexedDataSet<Room> = {};
    watcher_rules: IndexedDataSet<WatcherRule> = {};
    option_sets: IndexedDataSet<OptionSet> = {};
    debug: (message: any, ...args: any[]) => void;

    types = {
        endpoints : Endpoint,
        endpoint_types : EndpointType,
        controls : Control,
        option_sets: OptionSet,
        panels: Panel,
        panel_controls: PanelControl,
        rooms: Room,
        watcher_rules: WatcherRule

    };


    constructor() {
        this.debug = console.log;
    };

    loadData(data: any) {
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
                this.loadTableData<EndpointType,EndpointTypeData>(
                    add.endpoint_types, this.endpoint_types, EndpointType);
            }
            if (add.endpoints) {
                this.loadTableData<Endpoint,EndpointData>(
                    add.endpoints, this.endpoints, Endpoint);
            }
            if (add.controls) {
                this.loadTableData<Control,ControlData>(
                    add.controls, this.controls, Control);
            }
            if (add.option_sets) {
                this.loadTableData<OptionSet, OptionSetData>(
                    add.option_sets, this.option_sets, OptionSet
                );
            }
            if (add.panels) {
                this.loadTableData<Panel, PanelData>(
                    add.panels, this.panels, Panel
                );
            }
            if (add.panel_controls) {
                this.loadTableData<PanelControl, PanelControlData>(
                    add.panel_controls, this.panel_controls, PanelControl
                );
            }
            if (add.rooms) {
                this.loadTableData<Room, RoomData>(
                    add.rooms, this.rooms, Room
                );
            }
            if (add.watcher_rules) {
                this.loadTableData<WatcherRule, WatcherRuleData>(
                    add.watcher_rules, this.watcher_rules, WatcherRule
                );
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
            let del = (<IDCDataDelete>data.delete);
            let table = del.table;
            let _id = del._id;

            // Remove references from foreign key objects
            if (this[table][_id]) {
                let deleteRec = (<DCSerializable>this[table][_id]);
                for (let fkDef of deleteRec.foreignKeys) {
                    deleteRec[fkDef.fkObjProp].removeReference(deleteRec);
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
    indexForeignKeys(objects: IndexedDataSet<DCSerializable>) {
        for (let id in objects) {
            let obj = objects[id];

            for (let fkDef of obj.foreignKeys) {
                let fkObjs = this[fkDef.fkTable];

                if (obj[fkDef.fkIdProp]) {
                    let fkId = obj[fkDef.fkIdProp];  // The the foreign key id value
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


    loadTableData<Type extends DCSerializable, TypeData extends DCSerializableData>
        (newData: IndexedDataSet<TypeData>,
         modelData: IndexedDataSet<Type>,
         ctor: { new(id: string, data: any): Type })
    : void {
        for (let id in newData) {
            if (modelData[id]) {
                modelData[id].loadData(newData[id]);
            }
            else {
                modelData[id] = new ctor(id, newData[id]);
            }
        }
    }

    getItem<Type> (id: string, table: string) : Type {
        if ( this[table][id]) {
            return (<Type>this[table][id]);
        }

        this[table][id] = new this.types[table](id);
        return (<Type>this[table][id]);
    }

    getTableItem(id: string, table: string) : DCSerializable {
        switch (table) {
            case Endpoint.tableStr:
                return this.getItem<Endpoint>(id, table);
            case EndpointType.tableStr:
                return this.getItem<EndpointType>(id, table);
            case Room.tableStr:
                return this.getItem<Room>(id, table);
            case OptionSet.tableStr:
                return this.getItem<OptionSet>(id, table);
            case Panel.tableStr:
                return this.getItem<Panel>(id, table);
            case PanelControl.tableStr:
                return this.getItem<PanelControl>(id, table);
            case Control.tableStr:
                return this.getItem<Control>(id, table);
            case WatcherRule.tableStr:
                return this.getItem<WatcherRule>(id, table);
        }
    }
}
