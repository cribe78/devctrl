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
var menu_service_1 = require("./menu.service");
var Control_1 = require("../shared/Control");
var record_editor_service_1 = require("./record-editor.service");
var EndpointComponent = (function () {
    function EndpointComponent(route, dataService, menu, recordService) {
        this.route = route;
        this.dataService = dataService;
        this.menu = menu;
        this.recordService = recordService;
    }
    EndpointComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.endpoints = this.dataService.getTable(Endpoint_1.Endpoint.tableStr);
        this.route.params.subscribe(function (params) {
            _this.endpointId = params['id'];
            console.log("endpoint " + _this.endpointId + " loaded");
            _this.obj = _this.endpoints[_this.endpointId];
            if (_this.obj) {
                _this.menu.pageTitle = _this.obj.name;
                _this.controls = _this.obj.referenced[Control_1.Control.tableStr];
                _this.menu.toolbarSelectTable(Endpoint_1.Endpoint.tableStr, "endpoints.endpoint", _this.obj._id);
            }
        });
    };
    EndpointComponent.prototype.controlIds = function () {
        return Object.keys(this.controls);
        //Object.keys(this.controls).map(key => this.controls[key]);
    };
    EndpointComponent.prototype.togglePanel = function (panel) {
        if (!angular.isDefined(panel.opened)) {
            panel.opened = true;
        }
        else {
            panel.opened = !panel.opened;
        }
    };
    EndpointComponent.prototype.isPanelOpen = function (panel) {
        return angular.isDefined(panel.opened) && panel.opened;
    };
    EndpointComponent.prototype.addControl = function ($event) {
        this.recordService.editRecord($event, '0', 'controls', {
            'endpoint_type_id': this.obj.endpoint_type_id
        });
    };
    EndpointComponent.prototype.editEndpoint = function ($event) {
        this.recordService.editRecord($event, this.endpointId, 'endpoints');
    };
    EndpointComponent.prototype.generateConfig = function ($event) {
        this.dataService.generateEndpointConfig($event, this.endpointId);
    };
    EndpointComponent.prototype.trackById = function (index, val) {
        return val._id;
    };
    return EndpointComponent;
}());
EndpointComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-endpoint',
        template: "\n<md-toolbar>\n    <div class=\"md-toolbar-tools\">\n        <button md-button devctrl-admin-only (click)=\"addControl($event)\">Add Control</button>\n        <button md-button devctrl-admin-only (click)=\"editEndpoint($event)\">Edit Device</button>\n        <button md-button devctrl-admin-only (click)=\"generateConfig($event)\">Generate Config</button>\n        <span flex></span>\n        <devctrl-endpoint-status [endpointId]=\"obj._id\"></devctrl-endpoint-status>\n    </div>\n</md-toolbar>\n\n<md-list>\n    <template ngFor let-controlId [ngForOf]=\"controlIds()\">\n        <a md-list-item>\n            <ctrl flex [controlId]=\"controlId\"></ctrl>\n        </a>\n        <md-divider></md-divider>\n    </template>\n</md-list>   \n"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        data_service_1.DataService,
        menu_service_1.MenuService,
        record_editor_service_1.RecordEditorService])
], EndpointComponent);
exports.EndpointComponent = EndpointComponent;
//# sourceMappingURL=endpoint.component.js.map