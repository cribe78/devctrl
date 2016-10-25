"use strict";
var RecordController = (function () {
    function RecordController(dataService) {
        this.dataService = dataService;
        this.editStack = [];
        this.newRow = this.obj._id == "0";
        this.schema = this.dataService.getSchema(this.obj.table);
    }
    RecordController.prototype.addRow = function () {
        this.dataService.addRow(this.obj, function () { });
        this.close(true);
    };
    RecordController.prototype.deleteRow = function () {
        this.dataService.deleteRow(this.obj);
        this.close(true);
    };
    RecordController.prototype.editOtherRow = function (row) {
        this.editStack.push(this.obj);
        this.obj = row;
        this.schema = this.dataService.getSchema(row.tableName);
    };
    RecordController.prototype.updateRow = function () {
        this.dataService.updateRow(this.obj);
        this.close(true);
    };
    RecordController.prototype.cloneRow = function () {
        var _this = this;
        var newValues = this.obj.getDataObject();
        newValues['name'] = "";
        var newRow = this.dataService.getNewRowRef(this.obj.table, newValues);
        this.dataService.addRow(newRow, function (newRec) {
            _this.obj = newRec;
        });
    };
    RecordController.prototype.close = function (popStack) {
        if (popStack && this.editStack.length > 0) {
            this.obj = this.editStack.pop();
            this.schema = this.dataService.getSchema(this.obj.table);
        }
        else {
            this.dataService.editRecordClose();
        }
    };
    RecordController.$inject = ['DataService'];
    return RecordController;
}());
exports.RecordController = RecordController;
//# sourceMappingURL=record.controller.js.map