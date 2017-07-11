import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-switch-readonly',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-flex-layout">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <button md-mini-fab [disabled]="! cs.value" color="accent"></button>
    `,
    //language=CSS
    styles: [`
        button {
            pointer-events: none;
        }
    `]
})
export class SwitchReadonlyControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }
}