import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({

    selector: 'ctrl-level',
    template: `
<div class="devctrl-ctrl devctrl-ctrl-flex-layout">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <span style="flex: 1 1; display: flex;">
        <span class="level-bar" [style.width.%]="normalizedValue()">&nbsp;</span>
        <span class="level-remaining" [style.width.%]="100 - normalizedValue()">&nbsp;</span>
    </span>
</div>  
    `,
    styles: [`
.level-bar {
    background-color: #3f51b5;
    height: 16px;
}
.level-remaining { 
    background-color: #bdbdbd;
    height: 16px;  
}
`]
})
export class LevelControl implements OnInit {
    min : number;
    max : number;

    constructor(public cs: ControlService) { }

    ngOnInit() {
        // Initialize min and max values
        this.max = this.cs.intConfig('max');
        this.min = this.cs.intConfig('min');

        if (this.min >= this.max) {
            this.max = this.min + 1;
        }
    }

    normalizedValue() {
        // Normalize a numeric value to a scale of 0 - 100
        let rawVal = this.cs.value;

        let limVal = rawVal < this.min ? this.min : rawVal;
        limVal = limVal > this.max ? this.max : limVal;

        let normVal = 100 * (limVal + ( 0 - this.min )) / ( this.max - this.min );

        return normVal;
    }
}