import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-select-readonly',
    template: `
<div class="devctrl-ctrl"
     style="display: flex; flex-direction: row;">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <span>{{cs.selectValueName()}}</span>
</div>                
    `
})
export class SelectReadonlyControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }
}