import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';
import {DataService} from "../../data.service";

@Component({
    moduleId: module.id,
    selector: 'ctrl-awhe130-preset-map',
    template: `
<div class="devctrl-ctrl">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" [ngClass]="imageMapClasses()">
        <defs>
            <style>
                .cls-1 {
                    fill:#9FA8DA;
                    cursor: pointer; 
                }
                .cls-1:hover {
                    fill:#EC407A;
                }
                .cls-1.selected {
                    fill: #F06292;
                }
                .cls-1,.cls-4{
                    stroke: rgba(0,0,0,.5);
                }
                .cls-1,.cls-4,.cls-5{stroke-miterlimit:10;}
                .cls-2{
                    font-size:32px;
                    pointer-events: none;   
                }
                .cls-2,.cls-3,.cls-6{
                    fill:#000000;
                    font-weight:500;
                }
                .cls-3{font-size:24px;}
                .cls-4{fill:none;stroke-width:3px;}
                .cls-6{
                    font-size:28px;
                }
                .no-click {
                    pointer-events: none;
                }
                .podium {
                    fill: #E0E0E0;
                }
            </style>
        </defs>
        <svg:g [ngSwitch]="imageMap">
            <svg:g *ngSwitchCase="'pict-l'" preset-map-pict-l (presetSelected)="presetSelected($event)" />
            <svg:g *ngSwitchCase="'pict-r'" preset-map-pict-r (presetSelected)="presetSelected($event)" />
            <svg:g *ngSwitchCase="'orc-students'" preset-map-orc-students (presetSelected)="presetSelected($event)" />
            <svg:g *ngSwitchCase="'orc-instructor'" preset-map-orc-instructor (presetSelected)="presetSelected($event)" />
            <svg:g *ngSwitchDefault preset-map-default (presetSelected)="presetSelected($event)" />
        </svg:g>
    </svg>
</div>
    `,
    //language=CSS
    styles: [`
        .devctrl-ctrl {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .devctrl-ctrl-label {
            align-self: flex-start;
        }

        svg {
            width: 100%;
            height: 594px;
        }
        
        svg.orc-instructor {
            height: 200px;
            width: 640px;
        }
        
        svg.orc-students {
            height: 330px;
            width: 580px;
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

    imageMapClasses() {
        let map = {};
        map[this.imageMap] = true;

        return map;
    }
}