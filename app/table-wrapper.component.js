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
var record_editor_service_1 = require("data-editor/record-editor.service");
var TableWrapperComponent = (function () {
    function TableWrapperComponent(route, dataService, recordService) {
        this.route = route;
        this.dataService = dataService;
        this.recordService = recordService;
        this.sortColumn = 'id';
        this.sortReversed = false;
    }
    TableWrapperComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.tableName = params['name'];
            _this.data = _this.dataService.getTable(_this.tableName);
            _this.dataArray = _this.dataService.sortedArray(_this.tableName);
            _this.schema = _this.dataService.getSchema(_this.tableName);
            _this.dataService.publishStatusUpdate("table " + _this.tableName + " loaded");
        });
    };
    return TableWrapperComponent;
}());
TableWrapperComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-table-wrapper',
        template: "\n    <devctrl-table [tableName]=\"tableName\"></devctrl-table>\n"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        data_service_1.DataService,
        record_editor_service_1.RecordEditorService])
], TableWrapperComponent);
exports.TableWrapperComponent = TableWrapperComponent;
//# sourceMappingURL=table-wrapper.component.js.map