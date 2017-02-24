import { Component, OnInit } from '@angular/core';
import { ControlComponent } from '../control.component';
import {ControlService} from "../control.service";

@Component({
    moduleId: module.id,
    selector: 'ctrl-button',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-flex-layout">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <button md-button (click)="cs.setValue('')">{{cs.name}}</button>
</div>
`
})
export class ButtonControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }

}
