import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
    moduleId: module.id,
    selector: 'ctrl-f32-multibutton',
    //TODO: SVG icons aren't loading
    template: `
<div class="devctrl-ctrl"
     style="display: flex; flex-direction: row; align-items: center;">
    <label class="text-menu devctrl-ctrl-label">{{cs.name}}</label>
    <div *ngIf="cs.config('direction') !== 'reverse'">
        <button  md-icon-button (click)="cs.setValue(1)">
            <md-icon>play_arrow</md-icon>
        </button>
        <button  md-icon-button (click)="cs.setValue(2)">
            <md-icon>fast_forward</md-icon>
        </button>
        <button md-icon-button (click)="cs.setValue(3)">
            <md-icon svg-src="/images/icon_triple_fast.svg"></md-icon>
        </button>
    </div>
    <div *ngIf="cs.config('direction') == 'reverse'">
        <button  md-icon-button (click)="cs.setValue(1)">
            <md-icon  class="rot180">play_arrow</md-icon>
        </button>
        <button  md-icon-button (click)="cs.setValue(2)">
            <md-icon>fast_rewind</md-icon>
        </button>
        <button  md-icon-button (click)="cs.setValue(3)">
            <md-icon class="rot180" svgSrc="/images/icon_triple_fast.svg"></md-icon>
        </button>
    </div>
</div>    
    `
})
export class F32MultibuttonControl implements OnInit {
    constructor(private cs : ControlService) { }

    ngOnInit() { }
}