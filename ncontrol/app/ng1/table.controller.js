"use strict";
var TableController = (function () {
    function TableController($stateParams, dataService) {
        this.$stateParams = $stateParams;
        this.dataService = dataService;
        this.listed = [];
        this.sortColumn = 'id';
        this.sortReversed = false;
    }
    TableController.prototype.$onInit = function () {
        this.tableName = this.$stateParams.name;
        this.data = this.dataService.getTable(this.tableName);
        this.schema = this.dataService.getSchema(this.tableName);
        this.dataService.publishStatusUpdate("table " + this.tableName + " loaded");
        this.listData();
    };
    TableController.prototype.addRow = function ($event) {
        this.dataService.editRecord($event, '0', this.tableName);
        this.listData();
    };
    ;
    TableController.prototype.deleteRow = function (row) {
        this.dataService.deleteRow(row);
        this.listData();
    };
    TableController.prototype.fkDisplayVal = function (field, row) {
        for (var _i = 0, _a = row.foreignKeys; _i < _a.length; _i++) {
            var fkDef = _a[_i];
            if (fkDef.fkIdProp == field.name) {
                if (row[fkDef.fkObjProp].name) {
                    return row[fkDef.fkObjProp].name;
                }
                return row[field.name];
            }
        }
    };
    ;
    TableController.prototype.listData = function () {
        this.listed.length = 0;
        for (var id in this.data) {
            this.listed.push(this.data[id]);
        }
    };
    TableController.prototype.openRecord = function ($event, id) {
        this.dataService.editRecord($event, id, this.tableName);
    };
    ;
    TableController.prototype.setSortColumn = function (field) {
        if ('fields.' + field.name === this.sortColumn) {
            this.sortReversed = !this.sortReversed;
        }
        else {
            this.sortColumn = 'fields.' + field.name;
            this.sortReversed = false;
        }
    };
    TableController.prototype.updateRow = function ($event, row) {
        this.dataService.updateRow(row);
    };
    ;
    TableController.$inject = ['$stateParams', 'DataService'];
    return TableController;
}());
exports.TableController = TableController;
//# sourceMappingURL=table.controller.js.map