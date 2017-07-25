import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({

    selector: 'ctrl-button-set',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-flex-layout">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <md-button-toggle-group multiple (change)="setValue($event)">
        <md-button-toggle [value]="0" [checked]="!cs.value[0]">1</md-button-toggle>
        <md-button-toggle [value]="1" [checked]="!cs.value[1]">2</md-button-toggle>
        <md-button-toggle [value]="2" [checked]="!cs.value[2]">3</md-button-toggle>
        <md-button-toggle [value]="3" [checked]="!cs.value[3]">4</md-button-toggle>
    </md-button-toggle-group>
</div>    
    `
})
export class ButtonSetControl implements OnInit {
    constructor(public cs: ControlService) { }

    ngOnInit() { }

    setValue(values) {
        for (let idx in this.cs.value) {
            this.cs.value[idx] = true;
        }
        for (let v of values) {
            this.cs.value[v] = false;
        }

        this.cs.updateValue();
    }
}