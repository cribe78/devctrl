import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ControlService } from '../../control.service';
import {DataService} from "../../../data.service";

@Component({

    selector: '[preset-map-pict-r]',
    templateUrl: './preset-map-pict-r.html'
})
export class PresetMapPictRControl implements OnInit {
    @Output()presetSelected = new EventEmitter<any>();

    constructor(public cs: ControlService,
                private ds : DataService) { }

    ngOnInit() { }

    triggerPreset(preset) {
        this.presetSelected.emit(preset);
    }
}