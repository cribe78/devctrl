
import IComponentOptions = angular.IComponentOptions;
import {EndpointStatus} from "../../shared/Endpoint";
class EndpointStatusController {
    endpoint;
    endpointId;

    static $inject  = ['DataService'];
    constructor(private DataService) {}

    $onInit() {
        this.endpoint = this.DataService.getRowRef('endpoints', this.endpointId);
    }

    status() : EndpointStatus {

        if (! this.endpoint.fields.enabled) {
            return EndpointStatus.Disabled;
        }

        return (<EndpointStatus>this.endpoint.fields.status);
    }

    statusIcon() : string {
        var status = this.status();

        if (status == EndpointStatus.Online) {
            return "sync"
        }
        if (status == EndpointStatus.Offline) {
            return "sync_problem";
        }
        if (status == EndpointStatus.Disabled) {
            return "sync_disabled";
        }

        return "help";
    }

    statusIconClasses () : string {
        let status = this.status();

        if (status == EndpointStatus.Disabled) {
            return "md-disabled";
        }

        if (status == EndpointStatus.Offline) {
            return "md-warn";
        }

        return "md-primary md-hue-2";
    }
}


export let EndpointStatusComponent : IComponentOptions = {
    templateUrl: 'app/ng1/endpoint-status.html',
    controller: EndpointStatusController,
    bindings: {
        endpointId: '<'
    }
};
