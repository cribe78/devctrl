import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({

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
    constructor(public cs: ControlService) { }

    ngOnInit() { }
}