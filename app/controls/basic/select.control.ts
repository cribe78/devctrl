import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-select',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-select devctrl-ctrl-flex-layout">
    <div fxFlex="20%" class="text-menu devctrl-ctrl-label">{{cs.name}}</div>
    <form fxFlex="none">
        <md-select [(ngModel)]="cs.value"
                name="select"
                (change)="cs.updateValue()">
            <md-option [value]="obj.value" *ngFor="let obj of cs.selectOptionsArray(); trackBy: cs.trackByValue">
                {{obj.name}}
            </md-option>
        </md-select>
    </form>
</div>    
    `,
    styles: [`
form {
    margin-bottom: 0;
}
`]
})
export class SelectControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }
}