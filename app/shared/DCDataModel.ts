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
    IDCTableDefinition, IDCDataExchange
} from "./DCSerializable";
import {ActionTrigger, ActionTriggerData} from "./ActionTrigger";
import {OptionSet, OptionSetData} from "./OptionSet";
import {UserInfo, UserInfoData} from "./UserInfo";


export interface IndexedDataSet<T> {
    [index: string] : T;
}

export interface IDCSchema {
    [index: string] : IDCTableDefinition;
}

export class DCDataModel {
    tables: {
        [index: string] : IndexedDataSet<DCSerializable>
    } = {};
    /**
    endpoints : IndexedDataSet<Endpoint> = {};
    //endpoint_types : IndexedDataSet<EndpointType> = {};
    //controls : IndexedDataSet<Control> = {};
    panels: IndexedDataSet<Panel> = {};
    panel_controls: IndexedDataSet<PanelControl> = {};
    rooms: IndexedDataSet<Room> = {};
    watcher_rules: IndexedDataSet<ActionTrigger> = {};
    option_sets: IndexedDataSet<OptionSet> = {};
    userInfo : IndexedDataSet<UserInfo> = {};
    **/
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
        Room,
        UserInfo
    ];
    types : { [index: string] : { new(id, data?) : DCSerializable}} = {};
    schema : IDCSchema = {};


    constructor() {
        this.debug = console.log;

        for (let type of this.typeList) {
            let tschema = DCSerializable.typeTableDefinition(type);
            this.types[tschema.name] = type;
            this.schema[tschema.name]  = tschema;
            this.tables[tschema.name] = {};
        }
    };

    loadData(data: IDCDataExchange) {
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

            for (let t in add) {
                this.loadTableData(add[t], t);
            }


            // Call indexForeignKeys if relevant tables have been updated
            for (let t in this.schema) {
                let tschema = this.schema[t];
                let reindex = false;

                if (add[t]) {
                    reindex = true;
                }
                else {
                    for (let fkDef of tschema.foreignKeys) {
                        if (add[fkDef.fkTable]) {
                            reindex = true;
                        }
                    }
                }

                if (reindex) {
                    this.indexForeignKeys(this.tables[t]);
                }
            }

            /**
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
             **/
        }

        if (data.delete) {
            let del = (<IDCDataDelete>data.delete);
            let table = del.table;
            let _id = del._id;

            // Remove references from foreign key objects
            if (this.tables[table][_id]) {
                let deleteRec = (<DCSerializable>this.tables[table][_id]);
                for (let fkDef of deleteRec.foreignKeys) {
                    if (deleteRec[fkDef.fkObjProp]) {
                        deleteRec[fkDef.fkObjProp].removeReference(deleteRec);
                    }
                }

                //Delete the object
                delete this.tables[table][_id];
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
                let fkObjs = this.tables[fkDef.fkTable];

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


    loadTableData(newData: IndexedDataSet<DCSerializableData>, tableName: string) : void {
        let modelData = this.tables[tableName];
        let ctor = this.types[tableName];
        for (let id in newData) {
            if (modelData[id]) {
                modelData[id].loadData(newData[id]);
            }
            else {
                modelData[id] = new ctor(id, newData[id]);
            }
        }

        this.sortArrays(tableName);
    }

    getItem(id: string, table: string) : DCSerializable {
        if ( this.tables[table][id]) {
            return (this.tables[table][id]);
        }

        this.tables[table][id] = new this.types[table](id);
        return (this.tables[table][id]);
    }

    getTableItem(id: string, table: string) : DCSerializable {
        return this.getItem(id, table);
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
            let keys = Object.keys(this.tables[table]);
            for (let key of keys) {
                this.sortedArrays[table][sortProp].push(this.tables[table][key]);
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

        if (! this.tables[table]) {
            throw new Error("Request for invalid table array");
        }

        this.sortedArrays[table][sortProp] = [];
        this.sortArray(table, sortProp);

        return this.sortedArrays[table][sortProp];
    }
}
