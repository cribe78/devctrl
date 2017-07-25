import { Component, OnInit } from '@angular/core';
import {ControlService} from "../control.service";

@Component({

    selector: 'ctrl-switch',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-flex-layout">

    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <md-slide-toggle [(ngModel)]="cs.value"
                    (change)="cs.updateValue()">
                    
    </md-slide-toggle>

</div>    
    `
})
export class SwitchControl implements OnInit {
    constructor(public cs: ControlService) { }

    ngOnInit() { }
}