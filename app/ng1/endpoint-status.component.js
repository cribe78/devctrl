"use strict";
const Endpoint_1 = require("../../shared/Endpoint");
class EndpointStatusController {
    constructor(DataService) {
        this.DataService = DataService;
    }
    $onInit() {
        this.endpoint = this.DataService.getRowRef('endpoints', this.endpointId);
    }
    status() {
        if (!this.endpoint.fields.enabled) {
            return Endpoint_1.EndpointStatus.Disabled;
        }
        return this.endpoint.fields.status;
    }
    statusIcon() {
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
    }
    statusIconClasses() {
        let status = this.status();
        if (status == Endpoint_1.EndpointStatus.Disabled) {
            return "md-disabled";
        }
        if (status == Endpoint_1.EndpointStatus.Offline) {
            return "md-warn";
        }
        return "md-primary md-hue-2";
    }
}
EndpointStatusController.$inject = ['DataService'];
exports.EndpointStatusComponent = {
    templateUrl: 'app/ng1/endpoint-status.html',
    controller: EndpointStatusController,
    bindings: {
        endpointId: '<'
    }
};
//# sourceMappingURL=endpoint-status.component.js.map