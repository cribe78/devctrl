import {Component, Input, OnInit} from '@angular/core';
import {MenuService} from "../layout/menu.service";
import {PanelControl} from "../../shared/PanelControl";
import {ControlService} from "./control.service";

@Component({
    moduleId: module.id,
    selector: 'devctrl-ctrl',
    providers: [ControlService],
    templateUrl: 'control.html',
    styles: [`
.devctrl-ctrl-item {
    min-height: 48px;
    width: 100%;
    display: flex;
}

.devctrl-ctrl-admin-placeholder {
    width: 48px;
}

:host {
    width: 100%;
}

:host /deep/ .devctrl-ctrl-flex-layout {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
 }
 
:host /deep/ .devctrl-ctrl-label {
    margin-right: 12px;
    width: 180px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

:host /deep/ .devctrl-ctrl {
    min-height: 48px;
}

`]

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
