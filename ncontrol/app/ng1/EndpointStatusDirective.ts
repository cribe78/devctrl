export let EndpointStatusDirective  = ['DataService', function(DataService) : ng.IDirective {
    return {
        scope: {
            endpointId: '='
        },
        bindToController: true,
        controller: function(DataService) {
            var self = this;
            this.endpoint = DataService.getRowRef('endpoints', this.endpointId);

            this.status = function() {
                if (! self.endpoint.fields.enabled) {
                    return "disabled";
                }
                else if (self.endpoint.fields.status == '' || self.endpoint.fields.status == null) {
                    return "unknown";
                }

                return self.endpoint.fields.status;
            };

            this.statusIcon = function() {
                var status = self.status();

                if (status == "online") {
                    return "sync"
                }
                if (status == "disconnected") {
                    return "sync_problem";
                }
                if (status == "disabled") {
                    return "sync_disabled";
                }

                return "help";
            };

            this.statusIconClasses = function() {
                var status = self.status();

                if (status == "disabled") {
                    return "md-disabled";
                }

                if (status == "disconnected") {
                    return "md-warn";
                }

                return "md-primary md-hue-2";
            }
        },
        controllerAs: 'endpointStatus',
        templateUrl: 'ng/endpoint-status.html'
    }
}];