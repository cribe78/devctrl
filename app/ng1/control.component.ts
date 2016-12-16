import {DataService} from "../data.service";
import {Control} from "../../shared/Control";
import {PanelControl} from "../../shared/PanelControl";
import IComponentOptions = angular.IComponentOptions;
import {WatcherRule} from "../../shared/WatcherRule";
import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
import {RecordEditorService} from "../record-editor.service";

class CtrlController {
    menu;
    panelControl: PanelControl;
    controlId;
    panelContext: boolean;
    ctrl : Control;
    appConfig;
    type: string;

    static $inject = ['DataService', 'MenuService', 'RecordEditorService'];
    constructor(private dataService : DataService, private menuService,
        private recordService : RecordEditorService) {
        this.menu = menuService;
    }

    $onInit() {
        this.panelContext = !! this.panelControl;

        if (this.panelContext) {
            this.ctrl = this.panelControl.control;
        }
        else {
            this.ctrl = <Control>this.dataService.getRowRef(Control.tableStr, this.controlId);
        }

        this.appConfig = this.dataService.config;
        this.type = this.ctrl.usertype;
    }

    get name() {
        if (this.panelContext && this.panelControl.name) {
            return this.panelControl.name;
        }

        return this.ctrl.name;
    }

    get value() {
        return this.ctrl.value;
    }

    set value(val) {
        this.ctrl.value = val;
    }


    addWatcherRule($event) {
        this.recordService.editRecord($event, '0', WatcherRule.tableStr,
            { watched_control_id : this.ctrl._id});
    }

    config(key) {
        if (angular.isObject(this.ctrl.config) && this.ctrl.config[key]) {
            return this.ctrl.config[key];
        }

        return '';
    }

    editControl($event) {
        this.recordService.editRecord($event, this.ctrl._id, this.ctrl.table);
    }

    editOptions($event) {
        // Not currently implemented, enums removed from application
        if (this.ctrl.option_set) {
            this.recordService.editRecord(
                $event,
                this.ctrl.option_set_id,
                this.ctrl.option_set.table);
        }
        else {
            this.recordService.editRecord(
                $event,
                this.ctrl._id,
                this.ctrl.table
            );
        }
    }

    editPanelControl($event) {
        this.recordService.editRecord($event, this.panelControl._id, this.panelControl.table);
    }

    intConfig(key) {
        if (this.config(key)) {
            return parseInt(this.config(key));
        }

        return 0;
    }

    normalizedValue() {
        // Normalize a numeric value to a scale of 0 - 100
        let rawVal = this.ctrl.value;
        let max = this.intConfig('max');
        let min = this.intConfig('min');

        rawVal = rawVal < min ? min : rawVal;
        rawVal = rawVal > max ? max : rawVal;

        let normVal = (rawVal + ( 0 - min )) * ( max - min ) / ( 100 - 0);

        return normVal;
    }


    selectMenuItem(val) {
        this.setValue(val);
    }

    selectOptions() {
        if (this.ctrl.option_set) {
            return this.ctrl.option_set.options;
        }
        return !! this.ctrl.config.options ? this.ctrl.config.options : {};
    }

    setValue(val) {
        this.ctrl.value = val;
        this.updateValue(val);
    }

    selectValueName() {
        let opts = this.selectOptions();
        let value = this.ctrl.value;

        for (let val in opts) {
            if (val == value) {
                return opts[val];
            }
        }

        return value;
    }

    showLog($event) {
        this.dataService.showControlLog($event, this.ctrl);
    }

    updateValue(val) {
        this.dataService.updateControlValue(this.ctrl);
    }

}

export let ControlComponent : IComponentOptions = {
    templateUrl: 'app/ng1/ctrl.html',
    controller: CtrlController,
    bindings: {
        panelControl: '<',
        controlId: '<'
    }
};

@Directive({
    selector: 'ctrl'
})
export class ControlComponentNg2 extends UpgradeComponent {
    @Input() controlId;
    constructor(elementRef: ElementRef, injector: Injector) {
        super('ctrl', elementRef, injector);
    }
}
