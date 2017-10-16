import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {MenuService} from "../layout/menu.service";
import {DataService} from "../data.service";
import {Endpoint} from "../shared/Endpoint";
import {Control} from "../shared/Control";
import {Observable} from "rxjs/Rx";
import {CourseScheduleService, ICourseInfo} from "./course-schedule.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
    selector: 'devctrl-classroom-fullscreen',
    providers: [CourseScheduleService],
    template: `        
    <div class="fs-container">
        <div class="top-row">
            <div class="left-camera" *ngIf="leftCameraView">
                <img [src]="sourceLeft()" (error)="imgError($event)"/>
            </div>
            <div class="clock-container">
                <div class="date">{{currentTime | async | date: 'EEEE, MMMM d'}}</div>
                <div class="clock">{{currentTime | async | date: 'hh:mm'}}</div>
                <div class="course-row">
                    <div class="course-period">
                        <div class="course-period-title">PERIOD</div>
                        <div class="course-period-content">{{nextPeriod | async}}</div>
                    </div>
                    <div class="course-number" [mdMenuTriggerFor]="coursemenu">{{(nextCourse | async)?.code}}</div>
                    <md-menu #coursemenu="mdMenu" [overlapTrigger]="false">
                        <button mat-menu-item (click)="setSelectedCourse('')">Next Course</button>
                        <button mat-menu-item *ngFor="let course of courseList()"
                            (click)="setSelectedCourse(course.code)">
                            {{course.code}}
                        </button>    
                    </md-menu>
                    <div class="course-section">
                        <div class="course-section-title">SECTION</div>
                        <div class="course-section-content">{{nextSection | async}}</div>
                    </div>
                </div>
                <div class="time-rem-container">
                    <div class="time-rem-caption">{{timeRemainingCaption}}</div>
                    <div class="time-rem-inner">
                        <div class="time-rem-sign">{{timeRemainingSign}}</div>
                        <div class="time-rem">{{timeRemaining | async}}</div>
                        <div class="time-rem-after"></div>
                    </div>
                    <div class="time-rem-hhmm">
                        <div class="time-rem-hh">
                            {{timeRemainingHH}}
                        </div>
                        <div class="time-rem-mm">
                            {{timeRemainingMM}}
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="right-camera" *ngIf="rightCameraView">
                <img [src]="sourceRight()" (error)="imgError($event)"/>
            </div>
        </div>
        <devctrl-fullscreen-preset-map 
                [leftControl]="leftCameraPresetMap"
                [rightControl]="rightCameraPresetMap"
                [course]="nextCourse"> 
        </devctrl-fullscreen-preset-map>
    </div>
    `,
    styles: [`
        .clock-container {
            display: flex;
            flex-direction: column;
            flex: 1 1;
            justify-content: space-around;
        }

        .clock-container div {
            text-align: center;
            vertical-align: middle;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .clock {
            font-size: 4vw;
            font-family: "digital-clock";
            color: #bb5b5b;
        }

        .course-row {
            display: flex;
            flex-direction: row;
        }

        .course-number {
            flex: 2 2;
            font-size: 3.8vw;
            color: #404040;
            cursor: pointer;
        }

        .course-period {
            flex-direction: column;
            flex: 1 1;
        }

        .course-period-content {
            font-size: 2vw;
            color: #505050;
        }

        .course-period-title {
            font-size: 1.1vw;
            color: #606060;
        }

        .course-section {
            flex-direction: column;
            flex: 1 1;
            
        }

        .course-section-title {
            font-size: 1.1vw;
            color: #606060;
        }

        .course-section-content {
            font-size: 2vw;
            color: #505050;
        }
        
        .date {
            font-size: 1.4vw;
            text-transform: uppercase;
            color: #404040;
        }

        devctrl-fullscreen-preset-map {
            flex: 3 3;
            margin: 20px;
        }

        .fs-container {
            position: absolute;
            display: flex;
            flex-direction: column;
            width: 100vw;
            height: 100vh;
            background-color: #dcdcde; 
        }

        .top-row {
            display: flex;
            flex-direction: row;
            margin-left: 20px;
            margin-right: 20px;
            margin-top: 20px;
            height: 18vw;
        }

        .left-camera img {
            width: 32vw;
        }

        .right-camera img {
            width: 32vw;
        }

        .clock-container .time-rem-inner {
            font-size: 4vw;
            font-family: 'digital-clock';
            color: #bb5b5b;
            /* visibility: hidden; */
            flex-direction: row;
        }
        
        .clock-container .time-rem-after {
            width: 3vw;
        }
        .clock-container .time-rem-sign {
            font-size: 4vw;
            width: 3vw;
        }
        
        .time-rem-caption {
            font-size: 1.1vw;
            margin-bottom: 0.1vw;
            color: #525252;
        }
        
        .time-rem-container {
            flex-direction: column;
        }
        
        .time-rem-hhmm {
            flex-direction: row;
        }
        
        .time-rem-hh, .time-rem-mm {
            font-family: 'digital-clock';
            color: #bb5b5b;
            font-size: 1.1vw;
            width: 9.5vw;
        }
    `]
})
export class ClassroomFullscreenComponent implements OnInit
{


    leftCameraEndpoint : Endpoint;
    rightCameraEndpoint : Endpoint;
    leftCameraView : Control;
    rightCameraView : Control;
    leftCameraPresetMap;
    rightCameraPresetMap;
    dataLoaded = false;

    selectedCourseNumber = new BehaviorSubject<string>('');
    nextCourse : Observable<ICourseInfo>;
    nextPeriod : Observable<string>;
    nextSection : Observable<string>;
    timeRemaining : Observable<string>;
    instructors: Observable<string>;
    timeRemainingCaption: string;
    timeRemainingHH = "HH";
    timeRemainingMM = "MM";
    timeRemainingSign = " ";
    courses = [];
    room = "0205 ";

    constructor(private route : ActivatedRoute,
                public menu : MenuService,
                private ds : DataService,
                private cs : CourseScheduleService) {}

    ngOnInit() {
        this.route.data.subscribe( data => {
            this.menu.routeData = data;
        });

        this.ds.getTablePromise(Control.tableStr)
            .then (controls => { return this.ds.getTablePromise(Endpoint.tableStr)})
            .then(endpoints => {
                let leftCameraId = Object.keys(endpoints).find((id) => {
                    return endpoints[id].name == "PICT Camera 3";
                });
                let rightCameraId = Object.keys(endpoints).find((id) => {
                    return endpoints[id].name == "PICT Camera 2";
                });

                this.leftCameraEndpoint = endpoints[leftCameraId];
                this.rightCameraEndpoint = endpoints[rightCameraId];

                this.rightCameraView = this.rightCameraEndpoint.getControlByCtid("view") as Control;
                this.leftCameraView = this.leftCameraEndpoint.getControlByCtid("view") as Control;

                this.leftCameraPresetMap = this.leftCameraEndpoint.getControlByCtid("preset-map");
                this.rightCameraPresetMap = this.rightCameraEndpoint.getControlByCtid("preset-map");

                this.dataLoaded = true;
            });

        this.nextCourse = this.cs.nextCourse(this.room, this.selectedCourseNumber);


        this.nextPeriod = this.nextCourse.map( course => {
            let section = course.sections[course.nextSectionIdx];
            let meetTime = section.meetTimes[section.nextMeetTimeIdx];

            if (meetTime.meetPeriodBegin == meetTime.meetPeriodEnd) return meetTime.meetPeriodBegin;

            return `${meetTime.meetPeriodBegin}-${meetTime.meetPeriodEnd}`;
        });

        this.nextSection = this.nextCourse.map( course => {
            let section = course.sections[course.nextSectionIdx];
            return section.display;
        });

        this.timeRemaining = this.nextCourse.map(course => {
                let section = course.sections[course.nextSectionIdx];
                let meetTime = section.meetTimes[section.nextMeetTimeIdx];

                let untilStart = meetTime.msUntilStart;
                let untilEnd = meetTime.msUntilEnd;

                let remainingMs = untilEnd;
                this.timeRemainingCaption = "REMAINING";

                if (untilStart < untilEnd) {
                    remainingMs = untilStart;
                    this.timeRemainingCaption = "BEGINS IN"
                }

                this.timeRemainingSign = "";
                if (remainingMs < 0) {
                    this.timeRemainingSign = "-";
                    remainingMs =  0 - remainingMs;  // Use the positive number to calculate the minutes and seconds
                }

                let hourMs = 3600 * 1000;
                let remainingHours = Math.floor(remainingMs / hourMs);
                let minuteRemainder = remainingMs - remainingHours * hourMs;
                let minutes = Math.floor(minuteRemainder / 60000);
                let secondRemainder = minuteRemainder - minutes * 60000;
                let seconds = Math.floor(secondRemainder / 1000);
                let sec = ("00" + seconds).slice(-2);

                let hours = ("00" + remainingHours).slice(-2);
                let min = ("00" + minutes).slice(-2);

                if (remainingMs < 5 * 60 * 1000) {
                    // Count down the final 5 minutes by the second
                    this.timeRemainingHH = "MM";
                    this.timeRemainingMM = "SS";
                    return `${min}:${sec}`;
                }

                this.timeRemainingHH = "HH";
                this.timeRemainingMM = "MM";

                return `${hours}:${min}`;
            });


    }


    courseList() {
        return this.cs.courseList.filter((course) => {
            for (let sidx in course.sections) {
                let section = course.sections[sidx];
                for (let midx in section.meetTimes) {
                    let meetTime = section.meetTimes[midx];
                    if (meetTime.meetRoom == this.room) {
                        return true;
                    }
                }
            }

            return false;
        });
    }

    currentTime = Observable.interval(1000).map(() => new Date());

    imgError($event) {
        console.log("error loading camera view");
    }

    setSelectedCourse(val : string) {
        this.selectedCourseNumber.next(val);
    }

    sourceLeft() {
        if (this.leftCameraView.config["url"]) {
            return this.leftCameraView.config("url");
        }

        let path = this.leftCameraView.config["path"];
        let proto = this.leftCameraView.config["proto"];
        proto = proto ? proto : "https://";

        if (proto == "http" || proto == "https") {
            proto = proto + "://";
        }

        let host = this.leftCameraView.config["host"];
        host = host ? host : this.leftCameraView.endpoint.address;

        return proto + host + path;
    }

    sourceRight() {
        if (this.rightCameraView.config["url"]) {
            return this.rightCameraView.config("url");
        }

        let path = this.rightCameraView.config["path"];
        let proto = this.rightCameraView.config["proto"];
        proto = proto ? proto : "https://";

        if (proto == "http" || proto == "https") {
            proto = proto + "://";
        }

        let host = this.rightCameraView.config["host"];
        host = host ? host : this.rightCameraView.endpoint.address;

        return proto + host + path;
    }

}
