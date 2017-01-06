import {Component, Input} from '@angular/core';
import {DSTableDefinition} from "data-service-schema";
import {DCSerializable} from "shared/DCSerializable";
import {DataService} from "../data.service";
import { MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: 'devctrl-record',
    templateUrl: 'record.html',
})
export class RecordComponent {
    newRow : boolean;
    schema : DSTableDefinition;
    editStack = [];
    obj: DCSerializable;


    constructor(private dataService: DataService,
                public dialogRef: MdDialogRef<RecordComponent>) {}

    addRow() {
        this.dataService.addRow(this.obj, () => {});
        this.close(true);
    }

    deleteRow() {
        this.dataService.deleteRow(this.obj);
        this.close(true);
    }

    editOtherRow(row : DCSerializable) {
        this.editStack.push(this.obj);
        this.obj = row;
        this.schema = this.dataService.getSchema(row.table);
    }

    fkName(prop) {
        if (this.obj[prop]) {
            return this.obj[prop].name;
        }

        return 'unknown';
    }

    updateRow() {
        this.dataService.updateRow(this.obj);
        this.close(true);
    }

    cloneRow() {
        let newValues = this.obj.getDataObject();
        newValues['name'] = "";
        let newRow = this.dataService.getNewRowRef(this.obj.table, newValues);

        this.dataService.addRow(newRow, (newRec) => {
            this.obj = newRec;
        });
    }

    close(popStack) {
        if (popStack && this.editStack.length > 0) {
            this.obj = this.editStack.pop();
            this.schema = this.dataService.getSchema(this.obj.table);
        }
        else {
            this.dialogRef.close();
        }
    }

    objectUpdated(value, field) {
        this.obj[field] = value;
    }

    referencedTables() {
        return Object.keys(this.obj.referenced);
    }

    referencedArray(table) {
        return Object.keys(this.obj.referenced[table]).map(id =>
            { return this.obj.referenced[table][id]}
        );
    }

    trackById = DCSerializable.trackById;

    trackByName(index: number, field) {
        return field.name;
    }
}