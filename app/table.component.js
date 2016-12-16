"use strict";
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
var router_1 = require("@angular/router");
var data_service_1 = require("./data.service");
var record_editor_service_1 = require("./record-editor.service");
var TableComponent = (function () {
    function TableComponent(route, dataService, recordService) {
        this.route = route;
        this.dataService = dataService;
        this.recordService = recordService;
        this.sortColumn = 'id';
        this.sortReversed = false;
    }
    TableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.tableName = params['name'];
            _this.data = _this.dataService.getTable(_this.tableName);
            _this.dataArray = _this.dataService.sortedArray(_this.tableName);
            _this.schema = _this.dataService.getSchema(_this.tableName);
            _this.dataService.publishStatusUpdate("table " + _this.tableName + " loaded");
        });
    };
    TableComponent.prototype.addRow = function ($event) {
        this.recordService.editRecord($event, '0', this.tableName);
    };
    ;
    TableComponent.prototype.deleteRow = function (row) {
        this.dataService.deleteRow(row);
    };
    TableComponent.prototype.fkDisplayVal = function (field, row) {
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
    TableComponent.prototype.openRecord = function ($event, id) {
        this.recordService.editRecord($event, id, this.tableName);
    };
    ;
    TableComponent.prototype.setSortColumn = function (field) {
        if ('fields.' + field.name === this.sortColumn) {
            this.sortReversed = !this.sortReversed;
        }
        else {
            this.sortColumn = 'fields.' + field.name;
            this.sortReversed = false;
        }
    };
    TableComponent.prototype.updateRow = function ($event, row) {
        this.dataService.updateRow(row);
    };
    ;
    return TableComponent;
}());
TableComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-table',
        template: "\n<div layout=\"row\">\n    <span class=\"text-title\">{{schema.label}}</span>\n    <span flex></span>\n    <button md-button devctrl-admin-only (click)=\"addRow()\">Add</button>\n</div>\n\n\n<md-list>\n    <div md-list-item layout=\"row\">\n        <div flex=\"20\">\n            ID\n        </div>\n        <div *ngFor=\"let field of schema.fields\" flex class=\"table-header\" (click)=\"setSortColumn(field)\">\n            {{field.label}}\n        </div>\n        <div flex=\"5\"></div>\n    </div>\n    <md-divider></md-divider>\n    <md-list-item ng-repeat-start=\"(id, row) in data | toArray | orderBy: sortColumn : sortReversed\"\n                  layout=\"row\">\n        <div flex=\"20\" class=\"devctrl-id-text\">\n            <span>{{row._id}}</span>\n        </div>\n        <div class=\"md-list-item-text\"\n             ng-repeat=\"field in schema.fields\"\n             ng-switch=\"field.type\"\n             flex>\n            <p ng-switch-when=\"fk\">{{fkDisplayVal(field, row)}}</p>\n            <div ng-switch-when=\"bool\">\n                <md-checkbox class=\"md-primary\"\n                             ng-true-value=\"1\"\n                             ng-false-value=\"0\"\n                             ng-model=\"row[field.name]\"\n                             ng-change=\"updateRow($event, row)\"></md-checkbox>\n            </div>\n            <p ng-switch-default>{{row[field.name]}}</p>\n\n        </div>\n        <div flex=\"5\">\n            <button md-button  devctrl-admin-only (click)=\"openRecord($event, row._id)\">\n                <md-icon  md-font-set=\"material-icons\">edit</md-icon>\n            </button>\n        </div>\n    </md-list-item>\n    <md-divider ng-repeat-end></md-divider>\n</md-list>\n\n<button md-button devctrl-admin-only (click)=\"addRow()\">Add</button>    \n"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        data_service_1.DataService,
        record_editor_service_1.RecordEditorService])
], TableComponent);
exports.TableComponent = TableComponent;
//# sourceMappingURL=table.component.js.map