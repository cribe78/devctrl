"use strict";
var TableController = (function () {
    function TableController($stateParams, dataService) {
        this.$stateParams = $stateParams;
        this.dataService = dataService;
        this.sortColumn = 'id';
        this.sortReversed = false;
    }
    TableController.prototype.$onInit = function () {
        this.tableName = this.$stateParams.name;
        this.data = this.dataService.getTable(this.tableName);
        this.schema = this.dataService.getSchema(this.tableName);
        this.dataService.publishStatusUpdate("table " + this.tableName + " loaded");
    };
    TableController.prototype.addRow = function ($event) {
        this.dataService.editRecord($event, '0', this.tableName);
    };
    ;
    TableController.prototype.deleteRow = function (row) {
        this.dataService.deleteRow(row);
    };
    TableController.prototype.fkDisplayVal = function (field, row) {
        for (var _i = 0, _a = row.foreignKeys; _i < _a.length; _i++) {
            var fkDef = _a[_i];
            if (fkDef.fkIdProp == field.name) {
                if (row[fkDef.fkObjProp] && row[fkDef.fkObjProp].name) {
                    return row[fkDef.fkObjProp].name;
                }
                if (row[field.name]) {
                    return row[field.name];
                }
                return "unknown object " + field._id;
            }
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
    //TODO: present object values more smarterly
    TableController.template = "\n<div layout=\"row\">\n    <span class=\"text-title\">{{$ctrl.schema.label}}</span>\n    <span flex></span>\n    <md-button devctrl-admin-only ng-click=\"$ctrl.addRow()\">Add</md-button>\n</div>\n\n\n<md-list>\n    <md-list-item layout=\"row\">\n        <div flex=\"20\">\n            ID\n        </div>\n        <div ng-repeat=\"field in $ctrl.schema.fields\" flex class=\"table-header\" ng-click=\"$ctrl.setSortColumn(field)\">\n            {{field.label}}\n        </div>\n        <div flex=\"5\"></div>\n    </md-list-item>\n    <md-divider></md-divider>\n    <md-list-item ng-repeat-start=\"(id, row) in $ctrl.data | toArray | orderBy: $ctrl.sortColumn : $ctrl.sortReversed\"\n                  layout=\"row\">\n        <div flex=\"20\" class=\"devctrl-id-text\">\n            <span>{{row._id}}</span>\n        </div>\n        <div class=\"md-list-item-text\"\n             ng-repeat=\"field in $ctrl.schema.fields\"\n             ng-switch=\"field.type\"\n             flex>\n            <p ng-switch-when=\"fk\">{{$ctrl.fkDisplayVal(field, row)}}</p>\n            <div ng-switch-when=\"bool\">\n                <md-checkbox class=\"md-primary\"\n                             ng-true-value=\"1\"\n                             ng-false-value=\"0\"\n                             ng-model=\"row[field.name]\"\n                             ng-change=\"$ctrl.updateRow($event, row)\"></md-checkbox>\n            </div>\n            <p ng-switch-default>{{row[field.name]}}</p>\n\n        </div>\n        <div flex=\"5\">\n            <md-button  devctrl-admin-only ng-click=\"$ctrl.openRecord($event, row._id)\">\n                <md-icon  md-font-set=\"material-icons\">edit</md-icon>\n            </md-button>\n        </div>\n    </md-list-item>\n    <md-divider ng-repeat-end></md-divider>\n</md-list>\n\n<md-button devctrl-admin-only ng-click=\"$ctrl.addRow()\">Add</md-button>\n";
    return TableController;
}());
exports.TableController = TableController;
//# sourceMappingURL=table.controller.js.map