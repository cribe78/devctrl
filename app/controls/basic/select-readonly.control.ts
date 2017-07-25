import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({

    selector: 'ctrl-select-readonly',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-flex-layout">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <span>{{cs.selectValueName()}}</span>
</div>                
    `
})
export class SelectReadonlyControl implements OnInit {
    constructor(public cs: ControlService) { }

    ngOnInit() { }
}