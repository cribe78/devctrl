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
var Endpoint_1 = require("../../shared/Endpoint");
var data_service_1 = require("../data.service");
var EndpointType_1 = require("../../shared/EndpointType");
var menu_service_1 = require("../layout/menu.service");
var record_editor_service_1 = require("../data-editor/record-editor.service");
var EndpointsComponent = (function () {
    function EndpointsComponent(dataService, route, menu, recordService) {
        this.dataService = dataService;
        this.route = route;
        this.menu = menu;
        this.recordService = recordService;
    }
    EndpointsComponent.prototype.ngOnInit = function () {
        this.endpoints = this.dataService.getTable(Endpoint_1.Endpoint.tableStr);
        this.endpointsList = this.dataService.sortedArray('endpoints', 'name');
        this.menu.currentTopLevel = menu_service_1.MenuService.TOPLEVEL_DEVICES;
        this.menu.pageTitle = "Devices";
    };
    EndpointsComponent.prototype.addEndpoint = function ($event) {
        this.recordService.editRecord($event, '0', Endpoint_1.Endpoint.tableStr);
    };
    EndpointsComponent.prototype.addEndpointType = function ($event) {
        this.recordService.editRecord($event, '0', EndpointType_1.EndpointType.tableStr);
    };
    return EndpointsComponent;
}());
EndpointsComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-endpoints',
        template: "\n<div id=\"devctrl-content-canvas\">\n    <div class=\"devctrl-card\">\n        <md-toolbar color=\"primary\">\n            <div class=\"devctrl-toolbar-test\">\n                <button md-button *devctrlAdminOnly (click)=\"addEndpoint($event)\">Add Endpoint</button>\n                <button md-button *devctrlAdminOnly (click)=\"addEndpointType($event)\">Add Endpoint Type</button>\n            </div>\n        </md-toolbar>\n        <md-nav-list>\n            <ng-template ngFor let-endpoint [ngForOf]=\"endpointsList\">\n                 <a md-list-item \n                    (click)=\"menu.go(['devices', endpoint._id])\">\n                    {{endpoint.name}}\n                    <span class=\"devctrl-spacer\"></span>\n                    <devctrl-endpoint-status [endpointId]=\"endpoint._id\"></devctrl-endpoint-status>\n                    <md-icon>chevron_right</md-icon>\n                </a>\n                <md-divider></md-divider>           \n            </ng-template>       \n        </md-nav-list>\n</div>\n",
        //language=CSS
        styles: ["\n        .devctrl-card {\n            max-width: 900px;\n            flex: 1 1;\n        }\n    "]
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        router_1.ActivatedRoute,
        menu_service_1.MenuService,
        record_editor_service_1.RecordEditorService])
], EndpointsComponent);
exports.EndpointsComponent = EndpointsComponent;
//# sourceMappingURL=endpoints.component.js.map