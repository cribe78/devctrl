"use strict";
exports.RecordCtrl = ['DataService',
    function (DataService) {
        this.newRow = this.obj.id === '0';
        this.schema = DataService.getSchema(this.obj.tableName);
        this.editStack = [];
        var self = this;
        this.addRow = function () {
            DataService.addRow(self.obj);
            self.close(true);
        };
        this.deleteRow = function () {
            DataService.deleteRow(self.obj);
            self.close(true);
        };
        this.editOtherRow = function (row) {
            self.editStack.push(self.obj);
            self.obj = row;
            self.schema = DataService.getSchema(row.tableName);
        };
        this.updateRow = function () {
            DataService.updateRow(self.obj);
            self.close(true);
        };
        this.cloneRow = function () {
            var newRow = DataService.getNewRowRef(self.obj.tableName);
            newRow.fields = self.obj.fields;
            DataService.addRow(newRow, function (newRec) {
                self.obj = newRec;
                if (angular.isDefined(self.obj.fields.name)) {
                    self.obj.fields.name = "";
                }
            });
        };
        this.close = function (popStack) {
            if (popStack && self.editStack.length > 0) {
                self.obj = self.editStack.pop();
                self.schema = DataService.getSchema(self.obj.tableName);
            }
            else {
                DataService.editRecordClose();
            }
        };
    }
];
//# sourceMappingURL=RecordCtrl.js.map