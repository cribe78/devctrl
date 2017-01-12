import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-slider2d',
    template: `
<div class="devctrl-ctrl">
    <div>
        <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    </div>
    <div class="container">
        <label class="text-caption devctrl-ctrl-label label-indented">{{cs.config('xName')}}</label>
        <md-slider class="slider"
                   min="{{cs.intConfig('xMin')}}"
                   max="{{cs.intConfig('xMax')}}"
                   [step]="stepY"
                   [(ngModel)]="cs.value.x"
                   (change)="cs.updateValue()">
        </md-slider>
        <md-input-container>
            <input md-input 
                   class="devctrl-slider-input" type="number"
                   [(ngModel)]="cs.value.x"
                   (change)="cs.updateValue()">
        </md-input-container>
    
    </div>
    <div class="container">
        <label class="text-caption devctrl-ctrl-label label-indented">{{cs.config('yName')}}</label>
        <md-slider class="slider"
                   min="{{cs.intConfig('yMin')}}"
                   max="{{cs.intConfig('yMax')}}"
                   [step]="stepX"
                   [(ngModel)]="cs.value.y"
                   (change)="cs.updateValue()">
        </md-slider>
        <md-input-container>
            <input md-input 
                   class="devctrl-slider-input" type="number"
                   [(ngModel)]="cs.value.y"
                   (change)="cs.updateValue()">
        </md-input-container>
    </div>    
</div>
    `,
    styles: [`
.label-indented {
    margin-left: 24px;
}
div.container {
    display: flex;
    flex-direction: row;
}

div.devctrl-ctrl {
    display: flex;
    flex-direction: column;
}

.devctrl-slider-input {
    width: 60px;
}
.slider {
    flex: 1 1;
}

`]
})
export class Slider2dControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }

    stepX() {
        let step = this.cs.intConfig("stepX");
        return step ? step : 1;
    }

    stepY() {
        let step = this.cs.intConfig("stepY");
        return step ? step : 1;
    }
}

