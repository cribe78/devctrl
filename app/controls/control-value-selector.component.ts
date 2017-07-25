import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Control} from "../shared/Control";

@Component({

    selector: 'devctrl-control-value-selector',
    template: `
<div class="value-selector-switch" [ngSwitch]="control.usertype">
        <md-select *ngSwitchCase="'select'"
                [ngModel]="controlValue"
                name="select"
                [placeholder]="placeholder"
                (change)="valueChange($event.value)">
            <md-option [value]="obj.value" *ngFor="let obj of control.selectOptionsArray(); trackBy: trackByValue">
                {{obj.name}}
            </md-option>    
        </md-select>
        <md-slide-toggle *ngSwitchCase="'switch'"
            [ngModel]="controlValue"
            (change)="valueChange($event)"></md-slide-toggle>
        <md-input-container *ngSwitchDefault>
            <input mdInput name="value"  
                    [placeholder]="placeholder"
                    [ngModel]="controlValue"
                    (change)="valueChange($event)">
        </md-input-container>
</div>
    `,
    //language=CSS
    styles: [`        
        md-select {
            width: 100%;
        }
        
        .value-selector-switch {
            width: 100%;
        }
    `]
})
export class ControlValueSelectorComponent implements OnInit {
    @Input() control : Control;
    @Input() controlValue;
    @Input() placeholder : string;
    @Output() controlValueChange = new EventEmitter<any>();

    constructor() { }

    ngOnInit() { }

    trackByValue(idx, obj) {
        return obj.value;
    }

    valueChange(value) {
        this.controlValueChange.emit(value);
    }
}