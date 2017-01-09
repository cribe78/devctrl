import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-slider2d',
    template: `
<div>
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
</div>
<div class="coe-ctrl layout-row laout-align-space-between-center">
    <label class="text-caption devctrl-ctrl-label devctrl-label-indented">{{cs.config('xName')}}</label>
    <md-slider flex
               min="{{cs.intConfig('xMin')}}"
               max="{{cs.intConfig('xMax')}}"
               [(ngModel)]="xValue"
               (change)="cs.updateValue()">
    </md-slider>
    <input class="devctrl-slider-input" type="number"
           [(ngModel)]="slider2d.xValue"
           (change)="cs.updateValue()">

</div>
<div class="coe-ctrl"
     layout="row"
     layout-align="space-between center" >
    <label class="text-caption devctrl-ctrl-label devctrl-label-indented">{{cs.config('yName')}}</label>
    <md-slider flex
               min="{{cs.intConfig('yMin')}}"
               max="{{cs.intConfig('yMax')}}"
               [(ngModel)]="yValue"
               (change)="cs.updateValue()">
    </md-slider>
    <input class="devctrl-slider-input" type="number"
           [(ngModel)]="slider2d.yValue"
           (change)="cs.updateValue()">
</div>    
    `,
    styles: [`
.label-indented {
    margin-left: 24px;
}

.devctrl-slider-input {
    width: 60px;
}

`]
})
export class Slider2dControl implements OnInit {
    _xValue;
    _yValue;

    constructor(private cs : ControlService) { }

    ngOnInit() { }

    set xValue(val) {
        if (typeof this._xValue == 'undefined' || typeof this._yValue == 'undefined') {
            this.setXYVals();
        }

        this._xValue = val;
        this.cs.value = this._xValue + "," + this._yValue;
    }

    get xValue() {
        return this._xValue;
    }

    get yValue() {
        return this._yValue;
    }

    set yValue(val) {
        if (typeof this._xValue == 'undefined' || typeof this._yValue == 'undefined') {
            this.setXYVals();
        }

        this._yValue = val;
        this.cs.value = this._xValue + "," + this._yValue;
    }


    setXYVals() {
        let xyVals = this.cs.value.split(",");
        this._xValue = typeof xyVals[0] != 'undefined' ? xyVals[0] : 0;
        this._xValue = parseInt(this._xValue);
        this._yValue = typeof xyVals[1] != 'undefined' ? xyVals[1] : 0;
        this._yValue = parseInt(this._yValue);
    }
}