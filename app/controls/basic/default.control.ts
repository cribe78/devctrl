import { Component, OnInit } from '@angular/core';
import {ControlService} from "../control.service";

@Component({
    moduleId: module.id,
    selector: 'ctrl-default',
    template: `
    <div class="devctrl-ctrl"
     flex
     layout="row"
     layout-align="space-between center">
        <span>{{cs.name}}</span>
        <span>{{cs.value}}</span>
    </div>
    `
})
export class DefaultControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }
}