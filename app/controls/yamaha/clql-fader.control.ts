import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-clql-fader',
    template: `
<div class="devctrl-ctrl">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <md-slider style="flex: 3 1;"
               min="{{cs.intConfig('min')}}"
               max="{{cs.intConfig('max')}}"
               [(ngModel)]="cs.value"
               (change)="cs.updateValue()">
    </md-slider>
    <div>{{dbVal()}}db</div>
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
export class CLQLFaderControl implements OnInit {
    constructor(private cs : ControlService, private pipe : DecimalPipe) { }

    ngOnInit() { }

    dbVal() {
        let val = this.cs.value;
        if (val >= 423) {
            val = -20 + 0.05 * (val - 423);
        }
        else if (val >= 223) {
            val = -40 + 0.10 * (val - 223);
        }
        else if (val >= 33 ) {
            val = -78 + 0.20 * (val - 33);
        }
        else if (val >= 15 ) {
            val = -96 + (val - 15);
        }
        else if (val >= 1) {
            val = -133 + 3 * (val - 1);
        }
        else {
            return "-INF";
        }

        return this.pipe.transform(val, "1.2");
    }

}