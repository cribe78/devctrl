"use strict";
class RecordController {
    constructor(dataService) {
        this.dataService = dataService;
        this.editStack = [];
        this.newRow = this.obj._id == "0";
        this.schema = this.dataService.getSchema(this.obj.table);
    }
    addRow() {
        this.dataService.addRow(this.obj, () => { });
        this.close(true);
    }
    deleteRow() {
        this.dataService.deleteRow(this.obj);
        this.close(true);
    }
    editOtherRow(row) {
        this.editStack.push(this.obj);
        this.obj = row;
        this.schema = this.dataService.getSchema(row.table);
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
RecordController.$inject = ['DataService'];
exports.RecordController = RecordController;
//# sourceMappingURL=record.controller.js.map