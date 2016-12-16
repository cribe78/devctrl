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
var Endpoint_1 = require("../shared/Endpoint");
var data_service_1 = require("./data.service");
var EndpointType_1 = require("../shared/EndpointType");
var menu_service_1 = require("./menu.service");
var record_editor_service_1 = require("./record-editor.service");
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
        template: "\n<div layout=\"column\" *ngIf=\"menu.routeUrl[0] !== 'devices'\">\n            <md-toolbar layout=\"row\" devctrl-admin-only >\n                <div class=\"md-toolbar-tools\">\n                    <button md-button (click)=\"addEndpoint($event)\">Add Endpoint</button>\n                    <button md-button (click)=\"addEndpointType($event)\">Add Endpoint Type</button>\n                </div>\n            </md-toolbar>\n            <md-list>\n                <md-list-item \n                    *ngFor=\"let endpoint of endpointsList\"\n                    (click)=\"menu.go(['devices', endpoint._id])\">\n                    {{endpoint.name}}\n                    <span flex></span>\n                    <devctrl-endpoint-status [endpointId]=\"endpoint._id\"></devctrl-endpoint-status>\n                    <md-icon md-font-set=\"material-icons\" >chevron_right</md-icon>\n                </md-list-item>\n                <md-divider ng-repeat-end></md-divider>\n            </md-list>\n</div>\n"
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        router_1.ActivatedRoute,
        menu_service_1.MenuService,
        record_editor_service_1.RecordEditorService])
], EndpointsComponent);
exports.EndpointsComponent = EndpointsComponent;
//# sourceMappingURL=endpoints.component.js.map