import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ControlService } from '../../control.service';
import {DataService} from "../../../data.service";

@Component({

    selector: '[preset-map-orc-students]',
    templateUrl: './preset-map-orc-students.html',
    //language=CSS
    styles: [`        
    `]
})
export class PresetMapOrcStudents implements OnInit {
    @Output()presetSelected = new EventEmitter<any>();

    constructor(public cs: ControlService,
                private ds : DataService) { }

    ngOnInit() { }

    triggerPreset(preset) {
        this.presetSelected.emit(preset);
    }
}