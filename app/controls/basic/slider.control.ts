import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({

    selector: 'ctrl-slider',
    template: `
<div class="devctrl-ctrl">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <md-slider style="flex: 3 1;"
               min="{{cs.intConfig('min')}}"
               max="{{cs.intConfig('max')}}"
               [(ngModel)]="cs.value"
               (change)="cs.updateValue()">
    </md-slider>
    <md-input-container>
        <input mdInput
               class="devctrl-slider-input"
               type="number"
               [(ngModel)]="cs.value"
               (change)="cs.updateValue()">
    </md-input-container>
</div>    
    `,
    styles: [`
.devctrl-ctrl {
    display: flex; 
    flex-direction: row; 
    align-items: center;
}

.devctrl-slider-input {
    width: 60px;
}

`]
})
export class SliderControl implements OnInit {
    constructor(public cs: ControlService) { }

    ngOnInit() { }
}