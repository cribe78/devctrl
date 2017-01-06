import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-slider',
    template: `
<div class="devctrl-ctrl"
     style="display: flex; flex-direction: row;">

        <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
        <md-slider style="flex: 3 1;"
                   min="{{cs.intConfig('min')}}"
                   max="{{cs.intConfig('max')}}"
                   [(ngModel)]="cs.value"
                   (change)="cs.updateValue()">
        </md-slider>
        <div>
            <input class="devctrl-slider-input"
                   type="number"
                   [(ngModel)]="cs.value"
                   (change)="cs.updateValue()">
        </div>

</div>    
    `
})
export class SliderControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }
}