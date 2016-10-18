import {DataService} from "../data.service";
import {DCSerializable} from "../../shared/DCSerializable";
export class RecordController {
    newRow : boolean;
    schema;
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
        let newRow = this.dataService.getNewRowRef(this.obj.table);


        this.dataService.addRow(newRow, function(newRec) {
            this.obj = newRec;
            if (angular.isDefined(this.obj.name)) {
                this.obj.name = "";
            }
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
}