import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {RecordEditorService} from "data-editor/record-editor.service";
import {PanelControl} from "shared/PanelControl";
import {Control} from "shared/Control";
import {ActionTrigger} from "shared/ActionTrigger";
import {Router} from '@angular/router';

@Injectable()
export class ControlService {
    private _panelControl : PanelControl;
    private _control : Control;
    panelContext = false;

    constructor(private dataService : DataService,
                private recordService : RecordEditorService,
                private router: Router) {}


    get panelControl() : PanelControl {
        return this._panelControl;
    }

    set panelControl(pc: PanelControl) {
        this.panelContext = true;
        this._panelControl = pc;
        this._control = pc.control;
    }


    get control() {
        return this._control;
    }

    set control(val: Control) {
        this._control = val;
        if (this._panelControl && this._panelControl.control_id != val._id) {
            this._panelControl = undefined;
            this.panelContext = false;
        }
    }

    get controlId() {
        return this._control._id;
    }

    set controlId(id: string) {
        this.control = this.dataService.getRowRef(Control.tableStr, id) as Control;
    }

    get type() : string {
        return this._control.usertype;
    }

    get name() {
        if (this.panelContext && this._panelControl.name) {
            return this._panelControl.name;
        }

        return this._control.name;
    }

    get value() {
        return this._control.value;
    }

    set value(val) {
        this._control.value = val;
    }


    addWatcherRule($event) {
        this.recordService.editRecord($event, '0', ActionTrigger.tableStr,
            { watched_control_id : this.control._id});
    }

    config(key) {
        if (typeof this.control.config == 'object' && this.control.config[key]) {
            return this.control.config[key];
        }

        return '';
    }

    editControl($event) {
        //this.recordService.editRecord($event, this.control._id, this.control.table);
        this.router.navigate(['/controls', this.control.id]);
    }

    editOptions($event) {
        if (this.control.option_set) {
            this.recordService.editRecord(
                $event,
                this.control.option_set_id,
                this.control.option_set.table);
        }
        else {
            this.recordService.editRecord(
                $event,
                this.control._id,
                this.control.table
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

    floatConfig(key, defVal : number = 0) {
        if (typeof this.control.config !== 'object' ||
            typeof this.control.config[key] == 'undefined') {
            return defVal;
        }

        return parseFloat(this.control.config[key]);
    }



    selectMenuItem(val) {
        this.setValue(val);
    }

    selectOptions() {
        return this.control.selectOptions();
    }

    selectOptionsArray() {
        return this.control.selectOptionsArray();
    }

    setValue(val) {
        this.value = val;
        this.updateValue();
    }

    selectValueName() {
        return this.control.selectValueName();
    }

    showLog($event) {
        this.dataService.showControlLog($event, this.control);
    }

    trackByValue(idx, obj) {
        return obj.value;
    }

    updateValue() {
        this.dataService.updateControlValue(this.control);
        this.dataService.logAction(
            `Control update requested: set ${this.control.fkSelectName()} to ${this.value}`,
            ['control update requested'],
            [this.controlId, this.control.endpoint_id]);
    }
}