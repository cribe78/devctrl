import {DataService} from "../data.service";
import {Control} from "../../shared/Control";
import {PanelControl} from "../../shared/PanelControl";
import IComponentOptions = angular.IComponentOptions;

class CtrlController {
    menu;
    panelControl: PanelControl;
    controlId;
    panelContext: boolean;
    ctrl : Control;
    appConfig;
    type: string;

    static $inject = ['DataService', 'MenuService'];
    constructor(private dataService : DataService, private menuService) {
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


    config(key) {
        if (angular.isObject(this.ctrl.config) && this.ctrl.config[key]) {
            return this.ctrl.config[key];
        }

        return '';
    }

    editControl($event) {
        this.dataService.editRecord($event, this.ctrl._id, this.ctrl.table);
    }

    editOptions($event) {
        // Not currently implemented, enums removed from application
    }

    editPanelControl($event) {
        this.dataService.editRecord($event, this.panelControl._id, this.panelControl.table);
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
        this.ctrl.value = val;
        this.updateValue(val);
    }

    selectOptions() {
        return !! this.ctrl.config.options ? this.ctrl.config.options : {};
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