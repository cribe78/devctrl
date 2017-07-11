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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var data_service_1 = require("../data.service");
var DCSerializable_1 = require("../../shared/DCSerializable");
var record_editor_service_1 = require("./record-editor.service");
var menu_service_1 = require("../layout/menu.service");
var TableComponent = (function () {
    function TableComponent(route, dataService, ms, recordService) {
        this.route = route;
        this.dataService = dataService;
        this.ms = ms;
        this.recordService = recordService;
        this.sortColumn = 'id';
        this.sortReversed = false;
        this.trackById = DCSerializable_1.DCSerializable.trackById;
    }
    TableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.tableName = params['name'];
            _this.data = _this.dataService.getTable(_this.tableName);
            _this.dataArray = _this.dataService.sortedArray(_this.tableName);
            _this.schema = _this.dataService.getSchema(_this.tableName);
            _this.dataService.publishStatusUpdate("table " + _this.tableName + " loaded");
            _this.ms.pageTitle = _this.tableName;
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
                if (row[field.name]) {
                    return "unknown object " + row[field.name];
                }
            }
        }
        return '';
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
    TableComponent.prototype.sorted = function () {
        return this.dataService.sortedArray(this.tableName, "name");
    };
    TableComponent.prototype.updateRow = function ($event, row) {
        this.dataService.updateRow(row);
    };
    ;
    return TableComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TableComponent.prototype, "tableName", void 0);
TableComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-table',
        template: "\n<div id=\"devctrl-content-canvas\">\n    <div class=\"devctrl-card\">\n        <md-toolbar color=\"primary\">\n            <div class=\"devctrl-toolbar-tools\">\n                <span class=\"text-title\">{{schema.label}}</span>\n                <span class=\"devctrl-spacer\"></span>\n                <button md-button *devctrlAdminOnly (click)=\"addRow()\">Add</button>\n            </div>\n        </md-toolbar>\n        <md-list>\n            <md-list-item>\n                <div class=\"flex1\">\n                    ID\n                </div>\n                <div *ngFor=\"let field of schema.fields\" \n                       class=\"table-header flex1\" \n                       (click)=\"setSortColumn(field)\">\n                    {{field.label}}\n                </div>\n                <div class=\"flexPoint5\"></div>\n            </md-list-item>\n            <md-divider></md-divider>\n            <ng-template ngFor let-obj [ngForOf]=\"sorted()\" [ngForTrackBy]=\"trackById\">\n                <md-list-item>\n                    <div class=\"devctrl-id-text flex1\">\n                        <span>{{obj._id}}</span>\n                    </div>\n                    <ng-template ngFor let-field [ngForOf]=\"schema.fields\">\n                        <div class=\"flex1\"\n                             [ngSwitch]=\"field.type\">\n                            <p *ngSwitchCase=\"'fk'\">{{fkDisplayVal(field, obj)}}</p>\n                            <div *ngSwitchCase=\"'unbool'\">   \n                                <md-checkbox color=\"primary\"\n                                             [ngModel]=\"obj[field.name]\">\n                                             Check\n                                </md-checkbox>\n                            </div>\n                            <p *ngSwitchDefault>{{obj[field.name]}}</p>\n                        </div>\n                    </ng-template>\n                    <div class=\"flexPoint5\">\n                        <button md-button  *devctrlAdminOnly (click)=\"openRecord($event, obj._id)\">\n                            <md-icon>edit</md-icon>\n                        </button>\n                    </div>\n                </md-list-item>\n                <md-divider></md-divider>\n            </ng-template>\n        </md-list>\n\n        <button md-button *devctrlAdminOnly (click)=\"addRow()\">Add</button> \n    </div>\n </div>\n",
        //language=CSS
        styles: ["\n        .devctrl-card {\n            flex: 1 1;\n        }\n        \n        .devctrl-id-text span {\n            text-overflow: ellipsis;\n        }\n        \n        .flex2 {\n            flex: 2 2;\n        }\n        \n        .flex1 {\n            flex: 1 1 100px;\n        }\n        \n        .flexPoint5 {\n            flex: .5 .5;\n        }\n        \n        md-list-item .table-header {\n            text-overflow: ellipsis;\n            white-space: nowrap;\n            overflow: hidden;\n        }\n"]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        data_service_1.DataService,
        menu_service_1.MenuService,
        record_editor_service_1.RecordEditorService])
], TableComponent);
exports.TableComponent = TableComponent;
//# sourceMappingURL=table.component.js.map