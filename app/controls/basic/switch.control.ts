import { Component, OnInit } from '@angular/core';
import {ControlService} from "../control.service";

@Component({
    moduleId: module.id,
    selector: 'ctrl-switch',
    template: `
<div layout="row"
     layout-align="space-between center"
     class="devctrl-ctrl"
     flex >

        <label class="text-menu">{{cs.name}}</label>
        <md-slide-toggle [(ngModel)]="cs.value"
                    (change)="cs.updateValue()"></md-slide-toggle>

</div>    
    `
})
export class SwitchControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }
}