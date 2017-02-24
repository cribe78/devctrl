import {Component, Input, OnInit, Injector} from '@angular/core';
import {EndpointStatus, Endpoint} from "../../shared/Endpoint";
import {DataService} from "../data.service";

@Component({
    selector: 'devctrl-endpoint-status',
    template: `
<md-icon [ngClass]="statusIconClasses()" md-tooltip="{{statusStr()}}">{{statusIcon()}}</md-icon>
`,
    styles: [`
.devctrl-icon-disabled {
    color: #bdbdbd;
}    
`]

})
export class EndpointStatusComponent implements OnInit {
    endpoint : Endpoint;
    @Input() endpointId;
    @Input() backgroundColor;

    constructor(private dataService : DataService, private injector : Injector) {}

    ngOnInit() {
        this.endpoint = this.dataService.getRowRef('endpoints', this.endpointId) as Endpoint;
    }

    status() : EndpointStatus {
        if (! this.endpoint.enabled) {
            return EndpointStatus.Disabled;
        }

        return this.endpoint.status as EndpointStatus;
    }

    statusStr() : string {
        switch(this.status()) {
            case (EndpointStatus.Online) :
                return "Online";
            case (EndpointStatus.Offline) :
                return "Offline";
            case (EndpointStatus.Disabled) :
                return "Disabled";
            case (EndpointStatus.Unknown) :
                return "Unknown";
            default :
                return "unrecognized"
        }
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

    statusIconClasses () {
        let status = this.status();

        let classes = {
            'md-warn' : false
        };

        if (status == EndpointStatus.Disabled) {
            classes['devctrl-icon-disabled'] = true;
        }
        else if (status == EndpointStatus.Offline) {
            classes['md-warn'] = true;
        }
        else {
            if (this.backgroundColor != 'primary') {
                classes['md-primary'] = true;
            }
        }

        return classes;
    }
}