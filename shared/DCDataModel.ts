/*
DCDataModel

The data model shared by the various DevCtrl components

 */

import {
    Endpoint,
    EndpointData,
    EndpointType,
    EndpointTypeData,
    Control,
    ControlData,
    DCSerializable,
    DCSerializableData,
    IDCForeignKeyDef
} from "./Shared";


export interface IndexedDataSet<T> {
    [index: string] : T;
}

export class DCDataModel {
    endpoints : IndexedDataSet<Endpoint> = {};
    endpoint_types : IndexedDataSet<EndpointType> = {};
    controls : IndexedDataSet<Control> = {};
    debug: (message: any, ...args: any[]) => void;

    types = {
        endpoints : Endpoint,
        endpoint_type : EndpointType,
        controls : Control,
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


            // Call indexForeignKeys if relevant tables have been updated
            if (add.endpoints || add.endpoint_types) {
                this.indexForeignKeys(this.endpoints, Endpoint.foreignKeys);
            }
            if (add.controls || add.control_templates) {
                this.indexForeignKeys(this.controls, Control.foreignKeys);
            }

        }
    }

    /**
     *  For data model objects that hold references to other data model objects,
     *  initialize those references
     *
     *  TODO: set up "referenced" array
     */
    indexForeignKeys(objects: IndexedDataSet<DCSerializable>, fks: IDCForeignKeyDef[]) {
        for (let fkDef of fks) {
            let fkObjs = this[fkDef.fkTable];

            for (let id in objects) {
                let obj = objects[id];

                if (obj[fkDef.fkIdProp]) {
                    let fkId = obj[fkDef.fkIdProp];  // The the foreign key id value
                    if (!fkObjs[fkId]) {
                        // Create a new object if necessary
                        fkObjs[fkId] = new fkDef.type(fkId);
                    }

                    // Set reference to "foreign" object
                    obj[fkDef.fkObjProp] = fkObjs[fkId];
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
}
