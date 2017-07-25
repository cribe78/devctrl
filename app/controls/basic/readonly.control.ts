import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({

    selector: 'ctrl-readonly',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-flex-layout">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <span>{{cs.value}}</span>
</div>                
    `
})
export class ReadonlyControl implements OnInit {
    constructor(public cs: ControlService) { }

    ngOnInit() { }
}