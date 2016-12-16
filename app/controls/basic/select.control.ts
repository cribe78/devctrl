import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-select',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-select layout-row layout-align-space-between-center"
     flex>
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <form>
        <select [(ngModel)]="cs.value"
                name="select"
                (change)="cs.updateValue()">
            <option [value]="obj.value" *ngFor="let obj of cs.selectOptionsArray(); trackBy: cs.trackByValue">
                {{obj.name}}
            </option>
        </select>
    </form>
</div>    
    `
})
export class SelectControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }
}