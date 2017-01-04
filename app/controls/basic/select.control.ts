import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-select',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-select"
     fxLayout="row" 
     fxLayoutAlign="space-between center"
     fxFill
     style="display: flex; flex-direction: row;">
    <div fxFlex="20%" class="text-menu devctrl-ctrl-label">{{cs.name}}</div>
    <form fxFlex="none">
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
    //TODO: remove explicit style once flex-layout is working
})
export class SelectControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }
}