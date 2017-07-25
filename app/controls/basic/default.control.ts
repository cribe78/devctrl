import { Component, OnInit } from '@angular/core';
import {ControlService} from "../control.service";

@Component({

    selector: 'ctrl-default',
    template: `
    <div class="devctrl-ctrl devctrl-ctrl-flex-layout">
        <span class="text-menu devctrl-ctrl-label">{{cs.name}}</span>
        <span class="md-warn">Unimplemented control type {{cs.type}}</span>
        <span>{{cs.value}}</span>
    </div>
    `
})
export class DefaultControl implements OnInit {
    constructor(public cs: ControlService) { }

    ngOnInit() { }
}