import {Component, Input, OnInit} from '@angular/core';
import {MenuService} from "../layout/menu.service";
import {PanelControl} from "../../shared/PanelControl";
import {ControlService} from "./control.service";

@Component({
    moduleId: module.id,
    selector: 'devctrl-ctrl',
    providers: [ControlService],
    templateUrl: 'control.html'
})
export class ControlComponent implements OnInit {
    @Input()panelControl: PanelControl;
    @Input()controlId;
    @Input()control;

    constructor(private cs: ControlService,
                private menu: MenuService) {}

    ngOnInit() {
        if (this.panelControl) {
            this.cs.panelControl = this.panelControl;
        }
        else if (this.control) {
            this.cs.control = this.control;
        }
        else {
            this.cs.controlId = this.controlId;
        }
    }



}
