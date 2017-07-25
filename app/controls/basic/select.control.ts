import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({

    selector: 'ctrl-select',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-select devctrl-ctrl-flex-layout">
    <div class="text-menu devctrl-ctrl-label">{{cs.name}}</div>
    <form>
        <md-select [(ngModel)]="cs.value"
                name="select"
                (onClose)="cs.updateValue()">
            <md-option [value]="obj.value" *ngFor="let obj of cs.selectOptionsArray(); trackBy: cs.trackByValue">
                {{obj.name}}
            </md-option>
        </md-select>
    </form>
</div>    
    `,
    //language=CSS
    styles: [`
form {
    margin-bottom: 0;
}
md-select { 
    min-width: 160px;
}

`]
})
export class SelectControl implements OnInit {
    constructor(public cs: ControlService) { }

    ngOnInit() { }
}