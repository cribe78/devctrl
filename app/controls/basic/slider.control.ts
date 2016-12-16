import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-slider',
    template: `
<div class="devctrl-ctrl"
      flex
      layout="row"
      layout-align="space-between center">

        <label flex="initial" class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
        <md-slider flex
                   min="{{cs.intConfig('min')}}"
                   max="{{cs.intConfig('max')}}"
                   [(ngModel)]="cs.value"
                   (change)="cs.updateValue()">
        </md-slider>
        <div layout layout-align="center center">
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