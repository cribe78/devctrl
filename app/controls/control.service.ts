import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {RecordEditorService} from "../data-editor/record-editor.service";
import {PanelControl} from "../shared/PanelControl";
import {Control} from "../shared/Control";
import {ActionTrigger} from "../shared/ActionTrigger";
import {Router} from '@angular/router';
import {IndexedDataSet} from "../shared/DCDataModel";

@Injectable()
export class ControlService {
    private _panelControl : PanelControl;
    private _control : Control;
    private _siblings : { [ctid : string]: Control } = {};
    components : { [name: string] : Control} = {};
    panelContext = false;

    constructor(public dataService : DataService,
                public recordService : RecordEditorService,
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

    config(key, component = "") {
        if (component) {
            if (this.components[component]
                && typeof this.components[component].config == 'object'
                && this.components[component].config[key]) {
                return this.components[component].config[key];
            }
            return '';
        }

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

    findSiblingByCtid(ctid: string) {
        if (this._siblings[ctid]) {
            return this._siblings[ctid];
        }

        let controls = this.control.endpoint.referenced.controls as IndexedDataSet<Control>;
        for (let id of Object.keys(controls)) {
            if (controls[id].ctid == ctid) {
                this._siblings[ctid] = controls[id];
                return controls[id];
            }
        }

        throw new Error(`sibling control not located: ${ctid}`);
    }



    floatConfig(key, defVal : number = 0, component = "") {
        if (component) {
            if (this.components[component]
                && typeof this.components[component].config == 'object'
                && typeof this.components[component].config[key] != 'undefined') {
                return parseFloat(this.components[component].config[key]);
            }

            return defVal;
        }

        if (typeof this.control.config !== 'object' ||
            typeof this.control.config[key] == 'undefined') {
            return defVal;
        }

        return parseFloat(this.control.config[key]);
    }


    intConfig(key, component = "") {
        if (component) {
            if (this.components[component].config[key]) {
                return parseInt(this.components[component].config[key]);
            }
            else {
                return 0;
            }
        }
        if (this.config(key)) {
            return parseInt(this.config(key));
        }

        return 0;
    }


    loadComponentControls() {
        let componentConfig = this.control.config.componentControls;
        this.components = {};

        if (! componentConfig) {
            return {};
        }


        for (let component of Object.keys(componentConfig)) {
            this.components[component] = this.findSiblingByCtid(componentConfig[component]);
        }

        return this.components;
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

    updateComponentValue(componentName : string) {
        if (this.components[componentName]) {
            let control = this.components[componentName];
            this.dataService.updateControlValue(control);
            this.dataService.logAction(
                `Control update requested: set ${control.fkSelectName()} to ${control.value}`,
                ['control update requested'],
                [control._id, control.endpoint_id]);
        }
    }

    updateValue() {
        this.dataService.updateControlValue(this.control);
        this.dataService.logAction(
            `Control update requested: set ${this.control.fkSelectName()} to ${this.value}`,
            ['control update requested'],
            [this.controlId, this.control.endpoint_id]);
    }
}