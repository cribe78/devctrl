import {DataService} from "../data.service";
import {DCSerializable} from "../../shared/DCSerializable";
import {DSTableDefinition} from "./data-service-schema";
export class RecordController {
    newRow : boolean;
    schema : DSTableDefinition;
    editStack = [];
    obj: DCSerializable;
    
    static $inject = ['DataService'];
    constructor(private dataService: DataService) {
        this.newRow = this.obj._id == "0";
        this.schema = this.dataService.getSchema(this.obj.table);
    }

    addRow() {
        this.dataService.addRow(this.obj, () => {});
        this.close(true);
    }

    deleteRow() {
        this.dataService.deleteRow(this.obj);
        this.close(true);
    }
    
    editOtherRow(row) {
        this.editStack.push(this.obj);
        this.obj = row;
        this.schema = this.dataService.getSchema(row.tableName);
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
            this.dataService.editRecordClose();
        }
    }

    objectUpdated(value, field) {
        this.obj[field] = value;
    }
}