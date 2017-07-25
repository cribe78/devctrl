import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ControlService } from '../../control.service';
import {DataService} from "../../../data.service";

@Component({

    selector: '[preset-map-pict-l]',
    templateUrl: 'preset-map-pict-l.html'
})
export class PresetMapPictLControl implements OnInit {
    @Output()presetSelected = new EventEmitter<any>();

    constructor(public cs: ControlService,
                private ds : DataService) { }

    ngOnInit() { }

    triggerPreset(preset) {
        this.presetSelected.emit(preset);
    }
}