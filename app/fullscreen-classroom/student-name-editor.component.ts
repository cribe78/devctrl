import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DataService} from "../data.service";
import { MdDialogRef } from '@angular/material';
import {ControlService} from "../controls/control.service";
import {Control} from "../shared/Control";
import {CourseScheduleService} from "./course-schedule.service";


@Component({
    selector: 'devctrl-student-name-editor',
    providers: [CourseScheduleService],
    template: `
        <h2 md-dialog-title color="primary">
            <span class="course-name">{{course}}</span> - 
            <span class="seat-number">Seat {{seat}}</span>
        </h2>
        <md-dialog-content>
            <div class="form-container">
                <md-input-container>
                    <input mdInput name="name" 
                           [(ngModel)]="name" 
                           placeholder="Name (Last, First)"
                           [mdAutocomplete]="auto">
                </md-input-container>
                <md-autocomplete #auto="mdAutocomplete">
                    <md-option *ngFor="let option of options" [value]="option">
                        {{option}}
                    </md-option>
                </md-autocomplete>
            </div>
        </md-dialog-content>
        <md-dialog-actions>
            <div class="button-row">
                <button md-button color="primary" (click)="updateName()">Update</button>
                <button md-button (click)="close()">Cancel</button>
            </div>
        </md-dialog-actions>
    
`,
    styles: [`

    `]
})
export class StudentNameEditorComponent
{
    _control : Control;
    course: string  = '';
    term: string = '20178'; //TODO: fetch current term
    section: string = '';
    name: string = '';
    seat: number;
    options = [];

    constructor(private ds : DataService,
                private cs : CourseScheduleService,
                public dialogRef: MdDialogRef<StudentNameEditorComponent>) {};

    close() {
        this.dialogRef.close();
    }

    get control() {
        return this._control;
    }

    set control(val: Control) {
        this._control = val;
        if (! this._control.config.names) this._control.config.names = {};
        if (! this._control.config.names[this.term]) this._control.config.names[this.term] = {};
        if (! this._control.config.names[this.term][this.course]) this._control.config.names[this.term][this.course] = {};
        if (! this._control.config.names[this.term][this.course]["options"]) {
            this._control.config.names[this.term][this.course]["options"] = [];
        }

        this.cs.courseRoster(this.course, this.section).subscribe( roster => {
            this.options = roster;
        });

        this.options = this._control.config.names[this.term][this.course]['options'];
    }

    updateName() {
        this._control.config.names[this.term][this.course][this.seat] = this.name;

        this.ds.updateRow(this.control);
        this.dialogRef.close();
    }
}