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
var Endpoint_1 = require("../../shared/Endpoint");
var data_service_1 = require("../data.service");
var EndpointStatusComponent = (function () {
    function EndpointStatusComponent(dataService, injector) {
        this.dataService = dataService;
        this.injector = injector;
    }
    EndpointStatusComponent.prototype.ngOnInit = function () {
        this.endpoint = this.dataService.getRowRef('endpoints', this.endpointId);
    };
    EndpointStatusComponent.prototype.status = function () {
        if (!this.endpoint.enabled) {
            return Endpoint_1.EndpointStatus.Disabled;
        }
        return this.endpoint.status;
    };
    EndpointStatusComponent.prototype.statusStr = function () {
        switch (this.status()) {
            case (Endpoint_1.EndpointStatus.Online):
                return "Online";
            case (Endpoint_1.EndpointStatus.Offline):
                return "Offline";
            case (Endpoint_1.EndpointStatus.Disabled):
                return "Disabled";
            case (Endpoint_1.EndpointStatus.Unknown):
                return "Unknown";
            default:
                return "unrecognized";
        }
    };
    EndpointStatusComponent.prototype.statusIcon = function () {
        var status = this.status();
        if (status == Endpoint_1.EndpointStatus.Online) {
            return "sync";
        }
        if (status == Endpoint_1.EndpointStatus.Offline) {
            return "sync_problem";
        }
        if (status == Endpoint_1.EndpointStatus.Disabled) {
            return "sync_disabled";
        }
        return "help";
    };
    EndpointStatusComponent.prototype.statusIconClasses = function () {
        var status = this.status();
        var classes = {
            'md-warn': false
        };
        if (status == Endpoint_1.EndpointStatus.Disabled) {
            classes['devctrl-icon-disabled'] = true;
        }
        else if (status == Endpoint_1.EndpointStatus.Offline) {
            classes['md-warn'] = true;
        }
        else {
            if (this.backgroundColor != 'primary') {
                classes['md-primary'] = true;
            }
        }
        return classes;
    };
    EndpointStatusComponent.prototype.statusIconColor = function () {
        var status = this.status();
        if (status == Endpoint_1.EndpointStatus.Online) {
            return 'primary';
        }
        if (status == Endpoint_1.EndpointStatus.Offline) {
            return 'warn';
        }
        return '';
    };
    return EndpointStatusComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], EndpointStatusComponent.prototype, "endpointId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], EndpointStatusComponent.prototype, "backgroundColor", void 0);
EndpointStatusComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-endpoint-status',
        template: "\n<md-icon [color]=\"statusIconColor()\" [ngClass]=\"statusIconClasses()\" md-tooltip=\"{{statusStr()}}\">{{statusIcon()}}</md-icon>\n",
        //language=CSS
        styles: ["\n.devctrl-icon-disabled {\n    color: #bdbdbd;\n}    \n"]
    }),
    __metadata("design:paramtypes", [data_service_1.DataService, core_1.Injector])
], EndpointStatusComponent);
exports.EndpointStatusComponent = EndpointStatusComponent;
//# sourceMappingURL=endpoint-status.component.js.map