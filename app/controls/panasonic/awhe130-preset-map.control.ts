import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';
import {DataService} from "../../data.service";

@Component({
    moduleId: module.id,
    selector: 'ctrl-awhe130-preset-map',
    template: `
<div class="devctrl-ctrl">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 421 593">
        <defs>
            <style>
                .cls-1 {
                    fill:#7997ce;
                    cursor: pointer; 
                }
                .cls-1:hover {
                    fill:#5f78a7;
                }
                .cls-1.selected {
                    fill: #8bd0e5;
                }
                .cls-1,.cls-4{stroke:#231f20;}
                .cls-1,.cls-4,.cls-5{stroke-miterlimit:10;}
                .cls-2{
                    font-size:40px;
                    pointer-events: none;   
                }
                .cls-2,.cls-3,.cls-6{fill:#2b2b2b;font-family:MyriadPro-BoldCond, Myriad Pro;font-weight:700;}
                .cls-3{font-size:24px;}
                .cls-4{fill:none;stroke-width:3px;}
                .cls-6{font-size:30px;}
                .cls-7{letter-spacing:-0.01em;}
                .cls-8{letter-spacing:0em;}
                .no-click {
                    pointer-events: none;
                }
                .podium {
                    fill: #9e8b65;
                }
            </style>
        </defs>
        <svg:g [ngSwitch]="imageMap">
            <svg:g *ngSwitchCase="'pict-l'" preset-map-pict-l (presetSelected)="presetSelected($event)" />
            <svg:g *ngSwitchCase="'pict-r'" preset-map-pict-r (presetSelected)="presetSelected($event)" />
            <svg:g *ngSwitchDefault>
                <text x="10" y="50" font-size="32">Unimplemented default image map</text>
            </svg:g>
        </svg:g>
    </svg>
</div>
    `,
    styles: [`
.devctrl-ctrl {
    height: 594px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.devctrl-ctrl-label {
    align-self: flex-start;
}

`]
})
export class AWHE130PresetMapControl implements OnInit {

    constructor(private cs : ControlService,
                private ds : DataService) { }

    ngOnInit() {}

    get imageMap() {
        return this.cs.config("imageMap");
    }

    presetSelected(value) {
        this.cs.setValue(value);
    }
}