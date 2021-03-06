import {Component, Input, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { MdDialog } from '@angular/material';
import {ControlService} from "../controls/control.service";
import {Control} from "../shared/Control";
import {DataService} from "../data.service";
import {RecordEditorService} from "../data-editor/record-editor.service";
import {StudentNameEditorComponent} from "./student-name-editor.component";
import {ICourseInfo} from "./course-schedule.service";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'devctrl-fullscreen-preset-map',
    providers: [
        {
            provide: 'controlServiceLeft',
            useClass: ControlService
        },
        {
            provide: 'controlServiceRight',
            useClass: ControlService
        }
    ],
    template: `
    <div class="class-section fullscreen-preset-map">
        <div class="class-left">
            <div *ngFor="let row of classRows"
                    class="class-row">
                <div *ngFor="let seat of row" class="seat">
                    <button md-raised-button (click)="presetSelected(seat, 'l')"
                            (onLongPress)="editName($event, seat, 'l')" long-press
                            [color]="buttonColor(seat, 'l')">
                        <div class="button-contents">
                            <div class="button-number"
                                 [class.button-number-big]="! buttonName(seat, 'l', 'first')">
                                {{seat}}
                            </div>
                            <div class="button-firstname">{{buttonName(seat, 'l', 'first')}}</div>
                            <div class="button-lastname">{{buttonName(seat, 'l', 'last')}}</div>
                        </div>
                    </button>
                </div>
            </div>
            <div class="class-row class-row-bottom wide-button">
                <button md-raised-button (click)="presetSelected(0, 'l')" [color]="buttonColor(0, 'l')">Wide</button>
            </div>
        </div>
        <div class="class-center-aisle">

        </div>
        <div class="class-right">
            <div *ngFor="let row of classRows"
                 class="class-row">
                <div *ngFor="let seat of row" class="seat">
                    <button md-raised-button  (click)="presetSelected(seat, 'r')"
                        (onLongPress)="editName($event, seat, 'r')" long-press
                            [color]="buttonColor(seat, 'r')">
                        <div class="button-contents">
                            <div class="button-number"
                                 [class.button-number-big]="! buttonName(seat, 'r', 'first')">{{seat}}
                            </div>
                            
                            <div class="button-firstname"
                                [class.button-long-firstname]="buttonLongFirstname(seat, 'r')">
                                {{buttonName(seat, 'r', 'first')}}
                            </div>
                            <div class="button-lastname">{{buttonName(seat, 'r', 'last')}}</div>
                        </div>
                    </button>
                </div>
            </div>
            <div class="class-row class-row-bottom wide-button">
                <div class="bottom-row-spacer">&nbsp;</div>
                <button md-raised-button (click)="presetSelected(0, 'r')" [color]="buttonColor(0, 'r')">Wide</button>
                <div class="settings-area">
                    <button md-button *ngIf="! isFullscreen()" 
                            (click)="requestFullscreen()" class="fullscreen-button">
                        <md-icon aria-label="Fullscreen" class="fullscreen-icon">fullscreen</md-icon>
                    </button>
                    <button md-button *ngIf="isFullscreen()"
                            (click)="exitFullscreen()" class="fullscreen-button">
                        <md-icon aria-label="Exit Fullscreen" class="fullscreen-icon">fullscreen_exit</md-icon>
                    </button>
                </div>

            </div>
        </div>
    </div>
`,
    styles: [`
        .bottom-row-spacer {
            flex: 1 1;
        }
        
        
        .button-contents {
            display: flex;
            flex-direction: column;
        }
        
        .button-lastname {
            flex: .8 .8;
            font-size: 0.8vw
        }
        
        .button-firstname {
            flex: 1 1;
            font-size: 1.1vw;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            line-height: 1.8vw;
        }
        
        .button-firstname.button-long-firstname {
            font-size: 0.7vw;
        }
        
        .button-number {
            font-size: 0.7vw;
        }
        
        .button-number.button-number-big {
            font-size: 1.2vw;
        }
        
        
        .class-section {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
        }
        
        .class-left, .class-right {
            display: flex;
            flex-direction: column;
            flex: 5 5;
         }
        
        .class-center-aisle {
            flex: 1 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;  
        }
        
        .class-row {
            display: flex;
            flex-direction: row;
            flex: 1 1; 
        }
        
        .class-row-bottom {
            justify-content: center;
            align-items: center;
        }
        
        
        .fullscreen-icon {
            font-size: 2.5vw;
            height: 3vw;
            width: 3vw;
        }
        
        .seat {
            flex: 1 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        
        .settings-area {
            flex: 1 1;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: flex-end;
            height: 100%;
        }
    `]
})
export class FullscreenPresetMapComponent implements OnInit
{
    sectionCs : { [index: string] : ControlService } = {};
    @Input() course : Observable<ICourseInfo>;
    courseCode;
    term = '20178';
    sectionCode = '';
    instructor = '';

    constructor(
        @Inject('controlServiceLeft') csl : ControlService,
        @Inject('controlServiceRight') csr : ControlService,
        private mdDialog: MdDialog
    ) {
        this.sectionCs['l'] = csl;
        this.sectionCs['r'] = csr;
    }

    ngOnInit() {
        this.course.subscribe(course => {
            this.courseCode = course.code;
            this.sectionCode = course.sections[course.nextSectionIdx].display;
        });

        window.addEventListener("contextmenu", (e) => { e.preventDefault()});
    }

    classRows = [
        [ 21, 22, 23, 24, 25],
        [ 16, 17, 18, 19, 20],
        [ 11, 12, 13, 14, 15],
        [  6,  7,  8,  9, 10],
        [  1,  2,  3,  4 , 5]
    ];


    buttonColor(seat: number, section: string) {
        if (! this.sectionCs[section].control) return '';
        if (this.sectionCs[section].value == seat) return 'primary';

        return '';
    }

    buttonName(seat: number, section: string, firstLast: string) {
        if (this.sectionCs[section]) {
            if (! this.sectionCs[section].control) {
                return '';
            }
            let cs = this.sectionCs[section];

            let names;
            if (names = cs.config("names")) {
                if (names[this.courseCode] && names[this.courseCode][this.sectionCode]
                    && names[this.courseCode][this.sectionCode][seat]) {
                    let fullname = names[this.courseCode][this.sectionCode][seat];
                    let components = fullname.split(",");
                    if (firstLast == "first" && components[1]) {
                        return components[1];
                    }
                    else if (firstLast == "last") {
                        return components[0];
                    }
                    else if (firstLast == "full") {
                        return fullname;
                    }

                }
            }
        }
        else {
            console.error("buttonName: unrecognized section " + section);
        }

        return '';
    }


    buttonLongFirstname(seat: number, section: string) {
        let name = this.buttonName(seat, section, "first");
        if (name.length > 11) {
            return true;
        }

        return false;
    }


    editName(event, seat: number, section: string) {
        console.log(`edit seat name ${seat}${section}`);
        let nameRef = this.mdDialog.open(StudentNameEditorComponent);
        nameRef.componentInstance.course = this.courseCode;
        nameRef.componentInstance.section = this.sectionCode;
        nameRef.componentInstance.name = this.buttonName(seat, section, "full");
        nameRef.componentInstance.seat = seat;
        nameRef.componentInstance.control = this.sectionCs[section].control;
    }


    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    isFullscreen() {
        return document.webkitIsFullScreen;
    }

    @Input() set leftControl(control: Control) {
        this.sectionCs['l'].control = control;
    }

    presetSelected(seat: number, section: string) {
        if (this.sectionCs[section]) {
            this.sectionCs[section].setValue(seat);
        }
        else {
            console.error("presetSelected: unrecognized section " + section);
        }

    }



    requestFullscreen() {
        let dl = document.documentElement as any;

        if (dl.requestFullscreen) {
            dl.requestFullscreen();
        }
        else if (dl.mozRequestFullScreen) {
            dl.mozRequestFullScreen();
        }
        else if (dl.webkitRequestFullScreen) {
            dl.webkitRequestFullScreen();
        }
    }


    @Input() set rightControl(control: Control) {
        this.sectionCs['r'].control = control;
    }
}