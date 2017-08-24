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
import {
    DCSerializable, IDCForeignKeyDef, DCSerializableData, IDCDataDelete,
    IDCTableDefinition
} from "./DCSerializable";
import {ActionTrigger, ActionTriggerData} from "./ActionTrigger";
import {OptionSet, OptionSetData} from "./OptionSet";


export interface IndexedDataSet<T> {
    [index: string] : T;
}

export interface IDCSchema {
    [index: string] : IDCTableDefinition;
}

export class DCDataModel {
    endpoints : IndexedDataSet<Endpoint> = {};
    endpoint_types : IndexedDataSet<EndpointType> = {};
    controls : IndexedDataSet<Control> = {};
    panels: IndexedDataSet<Panel> = {};
    panel_controls: IndexedDataSet<PanelControl> = {};
    rooms: IndexedDataSet<Room> = {};
    watcher_rules: IndexedDataSet<ActionTrigger> = {};
    option_sets: IndexedDataSet<OptionSet> = {};
    debug: (message: any, ...args: any[]) => void;
    sortedArrays : any = {};

    typeList = [
        ActionTrigger,
        Control,
        Endpoint,
        EndpointType,
        OptionSet,
        Panel,
        PanelControl,
        Room
    ];
    types : { [index: string] : { new(id, data?) : DCSerializable}} = {};
    schema : IDCSchema = {};


    constructor() {
        this.debug = console.log;

        for (let type of this.typeList) {
            let tschema = DCSerializable.typeTableDefinition(type);
            this.types[tschema.name] = type;
            this.schema[tschema.name]  = tschema;
        }
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
                this.loadTableData<ActionTrigger, ActionTriggerData>(
                    add.watcher_rules, this.watcher_rules, ActionTrigger
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
        let table = '';
        for (let id in newData) {
            if (modelData[id]) {
                modelData[id].loadData(newData[id]);
            }
            else {
                modelData[id] = new ctor(id, newData[id]);
            }
            if (! table) {
                table = modelData[id].table;
            }
        }

        if (table) {
            this.sortArrays(table);
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
            case ActionTrigger.tableStr:
                return this.getItem<ActionTrigger>(id, table);
        }
    }


    sortArrays(table : string) {
        if (this.sortedArrays[table]) {
            for (let prop in this.sortedArrays[table]) {
                this.sortArray(table, prop);
            }
        }
    }

    sortArray(table : string, sortProp : string) {
        if (this.sortedArrays[table] && this.sortedArrays[table][sortProp]) {
            this.sortedArrays[table][sortProp].length = 0;
            let keys = Object.keys(this[table]);
            for (let key of keys) {
                this.sortedArrays[table][sortProp].push(this[table][key]);
            }


            this.sortedArrays[table][sortProp].sort((a,b) => {
                if (a[sortProp] < b[sortProp]) {
                    return -1;
                }
                if (a[sortProp] > b[sortProp]) {
                    return 1;
                }

                return 0;
            });
        }
    }

    /**
     * sortedArray
     *
     * The data model maintains a set of sorted object arrays per request.  Return the
     * specified one
     * @param table
     * @param sortProp
     * @returns DCSerializable[]
     */

    sortedArray(table : string, sortProp : string = '_id') : DCSerializable[] {
        if (! this.sortedArrays[table]) {
            this.sortedArrays[table] = {};
        }

        let sorted = this.sortedArrays[table][sortProp];

        if (sorted) {
            return sorted;
        }

        if (! this[table]) {
            throw new Error("Request for invalid table array");
        }

        this.sortedArrays[table][sortProp] = [];
        this.sortArray(table, sortProp);

        return this.sortedArrays[table][sortProp];
    }
}