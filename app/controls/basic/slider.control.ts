import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
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
        <input md-input
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
    constructor(private cs : ControlService) { }

    ngOnInit() { }
}