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
var Endpoint_1 = require("../../shared/Endpoint");
var data_service_1 = require("../data.service");
var menu_service_1 = require("../layout/menu.service");
var Control_1 = require("../../shared/Control");
var record_editor_service_1 = require("../data-editor/record-editor.service");
var layout_service_1 = require("../layout/layout.service");
var EndpointComponent = (function () {
    function EndpointComponent(route, dataService, menu, recordService, ls) {
        this.route = route;
        this.dataService = dataService;
        this.menu = menu;
        this.recordService = recordService;
        this.ls = ls;
    }
    EndpointComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.controls = {};
        this.route.data.subscribe(function (data) {
            _this.menu.currentTopLevel = menu_service_1.MenuService.TOPLEVEL_DEVICES;
            _this.endpointId = data.endpoint._id;
            console.log("endpoint " + _this.endpointId + " loaded");
            _this.obj = data.endpoint;
            if (_this.obj) {
                _this.menu.pageTitle = _this.obj.name;
                _this.controls = _this.obj.referenced[Control_1.Control.tableStr];
                _this.menu.toolbarSelectTable(Endpoint_1.Endpoint.tableStr, ['devices'], _this.obj._id);
            }
        });
    };
    EndpointComponent.prototype.controlIds = function () {
        return Object.keys(this.controls);
        //Object.keys(this.controls).map(key => this.controls[key]);
    };
    EndpointComponent.prototype.togglePanel = function (panel) {
        if (typeof panel.opened == 'undefined') {
            panel.opened = true;
        }
        else {
            panel.opened = !panel.opened;
        }
    };
    EndpointComponent.prototype.isPanelOpen = function (panel) {
        return !!panel.opened;
    };
    EndpointComponent.prototype.addControl = function ($event) {
        this.recordService.editRecord($event, '0', 'controls', {
            endpoint: this.obj,
            ctid: this.endpointId + "-",
            poll: false
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
        template: "\n<div id=\"devctrl-content-canvas\">\n    <div class=\"devctrl-card\">\n        <md-toolbar color=\"primary\">\n            <div class=\"devctrl-toolbar-tools\">\n                <button md-button *devctrlAdminOnly (click)=\"addControl($event)\">Add Control</button>\n                <button md-button *devctrlAdminOnly (click)=\"editEndpoint($event)\">Edit Device</button>\n                <button md-button *devctrlAdminOnly (click)=\"generateConfig($event)\">Generate Config</button>\n                <span class=\"devctrl-spacer\">&nbsp;</span>\n                <devctrl-endpoint-status [endpointId]=\"obj._id\" backgroundColor=\"primary\"></devctrl-endpoint-status>\n            </div>\n        </md-toolbar>\n        \n        <md-list>\n            <ng-template ngFor let-controlId [ngForOf]=\"controlIds()\">\n                <md-list-item class=\"devctrl-ctrl-list-item\"><devctrl-ctrl [controlId]=\"controlId\"></devctrl-ctrl></md-list-item>\n                <md-divider></md-divider>\n            </ng-template>\n        </md-list>\n    </div>\n    <devctrl-action-history [hidden]=\"!ls.desktopWide\"></devctrl-action-history>\n </div>\n\n",
        //language=CSS
        styles: ["\n        .devctrl-card {\n            max-width: 900px;\n            flex: 1 1;\n        }\n    "]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        data_service_1.DataService,
        menu_service_1.MenuService,
        record_editor_service_1.RecordEditorService,
        layout_service_1.LayoutService])
], EndpointComponent);
exports.EndpointComponent = EndpointComponent;
//# sourceMappingURL=endpoint.component.js.map