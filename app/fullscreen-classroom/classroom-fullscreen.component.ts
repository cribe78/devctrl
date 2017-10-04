import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {MenuService} from "../layout/menu.service";
import {DataService} from "../data.service";
import {Endpoint} from "../shared/Endpoint";
import {Control} from "../shared/Control";
import {Observable} from "rxjs/Rx";
import {CourseScheduleService, ICourseInfo} from "./course-schedule.service";

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
                <div class="clock">{{currentTime | async | date: 'h:mm'}}</div>
                <div class="course-row">
                    <div class="course-period">
                        <div class="course-period-title">PERIOD</div>
                        <div class="course-period-content">{{nextPeriod | async}}</div>
                    </div>
                    <div class="course-number">{{(nextCourse | async)?.code}}</div>
                    <div class="course-section">
                        <div class="course-section-title">SECTION</div>
                        <div class="course-section-content">{{nextSection | async}}</div>
                    </div>
                </div>
                <div class="time-remaining">{{timeRemaining | async}}</div>
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
        }

        .clock {
            font-size: 4vw;
            font-family: "digital-clock";
        }

        .course-row {
            display: flex;
            flex-direction: row;
        }

        .course-number {
            flex: 2 2;
            font-size: 3.8vw;
        }

        .course-period {
            display: flex;
            flex-direction: column;
            flex: 1 1;
            align-items: center;
            justify-content: center;
        }

        .course-period-content {
            font-size: 2vw;
        }

        .course-period-title {
            font-size: 1.1vw;
        }

        .course-section {
            display: flex;
            flex-direction: column;
            flex: 1 1;
            align-items: center;
            justify-content: center;
        }

        .course-section-title {
            font-size: 1.1vw;
        }

        .course-section-content {
            font-size: 2vw;
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
            background-color: #c3bfc4;
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

        .time-remaining {
            font-size: 4vw;
            font-family: 'digital-clock';
            color: #e30f1c;
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
    course : DCScheduledCourse = {
        number: "DIG3020",
        section: "197D",
        period: "4/5"
    };

    nextCourse : Observable<ICourseInfo>;
    nextPeriod : Observable<string>;
    nextSection : Observable<string>;
    timeRemaining : Observable<string>;

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

        this.nextCourse = this.cs.nextCourse("0205 ");


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

        this.timeRemaining = this.nextCourse.mergeMap( course =>
            Observable.interval(1000).startWith(0).map(() => {
                let section = course.sections[course.nextSectionIdx];
                let meetTime = section.meetTimes[section.nextMeetTimeIdx];

                let untilStart = this.cs.timeUntilStarttime(meetTime);
                let untilEnd = this.cs.timeUntilEndtime(meetTime);

                let remainingMs = untilEnd;
                let sign = "";

                if (untilStart < untilEnd) {
                    remainingMs = untilStart;
                    sign = "-";
                }

                let hourMs = 3600 * 1000;
                let remainingHours = Math.floor(remainingMs / hourMs);
                let minuteRemainder = remainingMs - remainingHours * hourMs;
                let minutes = Math.ceil(minuteRemainder / 60000);
                let secondRemainder = minuteRemainder - minutes * 60000;
                let seconds = Math.floor(secondRemainder / 1000);

                let hours = remainingHours; //("0" + remainingHours).slice(-2);
                let min = ("00" + minutes).slice(-2);

                return `${sign}${hours}:${min}`;
            })
        );
    }


    currentTime = Observable.interval(1000).map(() => new Date());

    imgError($event) {
        console.log("error loading camera view");
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


export interface DCScheduledCourse {
    number: string;
    section: string;
    period: string;
}