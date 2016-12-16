"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var static_1 = require("@angular/upgrade/static");
var TableController = (function () {
    function TableController(dataService, recordService) {
        this.dataService = dataService;
        this.recordService = recordService;
        this.sortColumn = 'id';
        this.sortReversed = false;
    }
    TableController.prototype.$onInit = function () {
        this.data = this.dataService.getTable(this.tableName);
        this.schema = this.dataService.getSchema(this.tableName);
        this.dataService.publishStatusUpdate("table " + this.tableName + " loaded");
    };
    TableController.prototype.addRow = function ($event) {
        this.recordService.editRecord($event, '0', this.tableName);
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
        this.recordService.editRecord($event, id, this.tableName);
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
    return TableController;
}());
TableController.$inject = ['DataService', 'RecordEditorService'];
exports.TableController = TableController;
exports.TableComponent = {
    controller: TableController,
    bindings: {
        tableName: '<'
    },
    template: "\n<div layout=\"row\">\n    <span class=\"text-title\">{{$ctrl.schema.label}}</span>\n    <span flex></span>\n    <md-button devctrl-admin-only ng-click=\"$ctrl.addRow()\">Add</md-button>\n</div>\n\n\n<md-list>\n    <md-list-item layout=\"row\">\n        <div flex=\"20\">\n            ID\n        </div>\n        <div ng-repeat=\"field in $ctrl.schema.fields\" flex class=\"table-header\" ng-click=\"$ctrl.setSortColumn(field)\">\n            {{field.label}}\n        </div>\n        <div flex=\"5\"></div>\n    </md-list-item>\n    <md-divider></md-divider>\n    <md-list-item ng-repeat-start=\"(id, row) in $ctrl.data | toArray | orderBy: $ctrl.sortColumn : $ctrl.sortReversed\"\n                  layout=\"row\">\n        <div flex=\"20\" class=\"devctrl-id-text\">\n            <span>{{row._id}}</span>\n        </div>\n        <div class=\"md-list-item-text\"\n             ng-repeat=\"field in $ctrl.schema.fields\"\n             ng-switch=\"field.type\"\n             flex>\n            <p ng-switch-when=\"fk\">{{$ctrl.fkDisplayVal(field, row)}}</p>\n            <div ng-switch-when=\"bool\">\n                <md-checkbox class=\"md-primary\"\n                             ng-true-value=\"1\"\n                             ng-false-value=\"0\"\n                             ng-model=\"row[field.name]\"\n                             ng-change=\"$ctrl.updateRow($event, row)\"></md-checkbox>\n            </div>\n            <p ng-switch-default>{{row[field.name]}}</p>\n\n        </div>\n        <div flex=\"5\">\n            <md-button  devctrl-admin-only ng-click=\"$ctrl.openRecord($event, row._id)\">\n                <md-icon  md-font-set=\"material-icons\">edit</md-icon>\n            </md-button>\n        </div>\n    </md-list-item>\n    <md-divider ng-repeat-end></md-divider>\n</md-list>\n\n<md-button devctrl-admin-only ng-click=\"$ctrl.addRow()\">Add</md-button>"
};
var TableComponentNg2 = (function (_super) {
    __extends(TableComponentNg2, _super);
    function TableComponentNg2(elementRef, injector) {
        return _super.call(this, 'devctrlTable', elementRef, injector) || this;
    }
    return TableComponentNg2;
}(static_1.UpgradeComponent));
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TableComponentNg2.prototype, "tableName", void 0);
TableComponentNg2 = __decorate([
    core_1.Directive({
        selector: 'devctrl-table'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
], TableComponentNg2);
exports.TableComponentNg2 = TableComponentNg2;
//# sourceMappingURL=table.component.js.map