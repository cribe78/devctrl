"use strict";
var Endpoint_1 = require("../../shared/Endpoint");
var EndpointStatusController = (function () {
    function EndpointStatusController(DataService) {
        this.DataService = DataService;
    }
    EndpointStatusController.prototype.$onInit = function () {
        this.endpoint = this.DataService.getRowRef('endpoints', this.endpointId);
    };
    EndpointStatusController.prototype.status = function () {
        if (!this.endpoint.fields.enabled) {
            return Endpoint_1.EndpointStatus.Disabled;
        }
        return this.endpoint.fields.status;
    };
    EndpointStatusController.prototype.statusIcon = function () {
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
    EndpointStatusController.prototype.statusIconClasses = function () {
        var status = this.status();
        if (status == Endpoint_1.EndpointStatus.Disabled) {
            return "md-disabled";
        }
        if (status == Endpoint_1.EndpointStatus.Offline) {
            return "md-warn";
        }
        return "md-primary md-hue-2";
    };
    return EndpointStatusController;
}());
EndpointStatusController.$inject = ['DataService'];
exports.EndpointStatusComponent = {
    templateUrl: 'app/ng1/endpoint-status.html',
    controller: EndpointStatusController,
    bindings: {
        endpointId: '<'
    }
};
//# sourceMappingURL=endpoint-status.component.js.map