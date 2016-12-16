import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DataService} from "../data.service";

@Component({
    moduleId: module.id,
    selector: 'devctrl-ctrl',
    templateUrl: 'ctrl.html'
})
export class CtrlComponent {
    constructor(private route : ActivatedRoute,
                private dataService: DataService) {}

}
