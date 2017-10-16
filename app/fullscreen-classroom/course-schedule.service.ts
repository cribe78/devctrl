import { Injectable, Inject } from "@angular/core";
import { Headers, Http } from '@angular/http';
import { BehaviorSubject, Observable} from "rxjs/Rx";


@Injectable()
export class CourseScheduleService {

    //private _courses : BehaviorSubject<ICourseInfo[]> = new BehaviorSubject([]);
    //courses = this._courses.asObservable();
    private courses : Observable<ICourseInfo[]>;
    public courseList : ICourseInfo[] = [];


    //This is the source URL.  TO get around CORS restrictions, we'll just store a local copy in courses.json
    // THis file will need to be updated every semester
    //private queryUrl = "https://one.ufl.edu/apix/soc/schedule/?category=RES&course-code=&course-title=&cred-srch=&credits=&day-f=&day-m=&day-r=&day-s=&day-t=&day-w=&days=false&dept=015851001&eep=&fitsSchedule=false&ge=&ge-b=&ge-c=&ge-d=&ge-h=&ge-m=&ge-n=&ge-p=&ge-s=&instructor=&last-row=0&level-max=--&level-min=--&no-open-seats=false&online-a=&online-c=&online-h=&online-p=&period-b=&period-e=&prog-level=+&term=20178&var-cred=true&writing="
    private queryUrl = "/fullscreen-classroom/courses.json";
    private lastCourseCode = '';
    public faketime = 1507212911538 + 24 * 60 * 60 * 1000 * 4; // a time

    constructor(private http: Http) {
        this.courses = http.get(this.queryUrl).map(res => {
            let data = res.json();
            if (data[0]['COURSES']) {
                console.log("courses.json loaded");
                return data[0]['COURSES'];
            }

            console.error("invalid courses data recieved");
            return [];
        });

        Observable.interval(1000).subscribe(() => {
            this.faketime += 75000;
        })
    }



    courseRoster(course: string, section: string) : Observable<string[]> {
        return this.http.get(`/fullscreen-classroom/rosters/course-students?course=${course}&section=${section}`)
            .map( res => {
                if (res) {
                    return res.json();
                }
                return [];
        });
    }


    nextCourse(room: string, courseNumber: BehaviorSubject<string> = new BehaviorSubject('')) : Observable<ICourseInfo> {
        return Observable.interval(1000).startWith(0).combineLatest(this.courses, courseNumber,
            (interval, courses, courseNumber) => {
                let nextCourse = nullCourse;
                let nextCourseOffset = 7 * 24 * 60 * 60 * 1000 + 1;  // 7 days and a millisecond
                let nextMeetTimeIdx = 0;
                let nextSectionIdx = 0;

                this.courseList = courses;

                for (let course of courses) {
                    if (courseNumber == '' || courseNumber == course.code ) {
                        if (courseNumber == course.code) {
                            nextCourse = course;
                        }
                        for (let sidx in course.sections) {
                            let section = course.sections[sidx];
                            for (let midx in section.meetTimes) {
                                let meetTime = section.meetTimes[midx];
                                if (meetTime.meetRoom == room) {
                                    let offset = this.timeUntilEndtime(meetTime);
                                    if (offset < nextCourseOffset) {
                                        nextCourseOffset = offset;
                                        nextCourse = course;
                                        nextMeetTimeIdx = +midx;
                                        nextSectionIdx = +sidx;
                                        meetTime.msUntilEnd = offset;
                                        meetTime.msUntilStart = this.timeUntilStarttime(meetTime);
                                    }
                                }
                            }
                        }
                    }
                }

                nextCourse.nextSectionIdx = nextSectionIdx;
                if (nextCourse.sections[nextSectionIdx]) {
                    nextCourse.sections[nextSectionIdx].nextMeetTimeIdx = nextMeetTimeIdx;
                }

                if (nextCourse.code != this.lastCourseCode) {
                    console.log("CourseScheduleService: next course is " + nextCourse.code);
                    this.lastCourseCode = nextCourse.code;
                }
                return nextCourse;
            }
        ).share();
    }

    timeUntilEndtime(meetTime:  IMeetTime) {
        return this.timeUntilMeetTime(meetTime.meetTimeEnd, meetTime.meetDays);
    }

    timeUntilStarttime(meetTime:  IMeetTime) {
        let startDiff = this.timeUntilMeetTime(meetTime.meetTimeBegin, meetTime.meetDays);
        if (startDiff < 0) {
            startDiff += 7 * 24 * 60 * 60 * 1000;
        }

        return startDiff;
    }


    timeUntilMeetTime(time: string, meetDays: string[]) {
        let now = new Date();

        let amPm = time.slice(-2);
        let hm  = time.slice(0, -3);
        let hmSplit = hm.split(":");

        let endHour = +hmSplit[0];
        if (endHour == 12) {
            // 12 AM is 00:00, 12 PM is 12:00
            endHour = 0;
        }

        if (amPm == "PM") {
            endHour += 12;
        }

        let endMinute = +hmSplit[1];

        let endTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);
        let endTimeOffset = endTimeToday.getTime() - now.getTime();


        let dayDiff = 8;
        for (let dow of meetDays) {
            let diff = this.dowDiff(dow, now.getDay());
            // Allow negative endtime offsets up to 5 minutes
            if (endTimeOffset < -1000 * 60 * 5 && diff == 0) {
                diff = 7;
            }

            if (diff < dayDiff) {
                dayDiff = diff;
            }
        }

        let dayMs = 1000 * 60 * 60 * 24;

        return dayDiff * dayMs + endTimeOffset;
    }

    /**
     * Calculate the number of days from dayInt (0-6) until the next dayStr (M,T,W,R,F)
     */
    dowDiff(dayStr: string, dayInt: number) {
        let dow = {
            "M": 1,
            "T": 2,
            "W": 3,
            "R": 4,
            "F": 5
        };

        if (! dow[dayStr]) {
            console.error("invalid day of week identifier: " + dayStr);
            return 8;
        }

        let diff = dow[dayStr] - dayInt;
        if (diff < 0) {
            diff += 7;
        }

        return diff;
    }
}

export interface ISectionInfo {
    EEP?: string;
    LMS?: string;
    courseFee?: string;
    credits?: string;
    dNote?: string;
    deptCode: string;
    deptName: string;
    display: string;  // The section number
    finalExam?: string;
    genEd?: any[];
    grWriting?: string;
    instructors: IInstructorInfo[];
    meetTimes: IMeetTime[];
    nextMeetTimeIdx?: number;
    note?: string;
    number: string; // Also the section number
    rotateTitle?: string;
    sectWeb?: string;
}


export interface ICourseInfo {
    cNote: string;
    code: string;
    name: string;
    sections: ISectionInfo[]
    termInd: string;
    nextSectionIdx?: number;
}

export interface IInstructorInfo {
    name: string;
}

export interface IMeetTime {
    meetBldgCode: string;
    meetRoom: string;
    meetBuilding: string;
    meetDays: string[];
    meetNo: string;
    meetPeriodBegin: string;
    meetPeriodEnd: string;
    meetTimeBegin: string;
    meetTimeEnd: string;
    msUntilStart?: number;
    msUntilEnd?: number;
}

let nullSection : ISectionInfo = {
    deptCode: '',
    deptName: '',
    display: '',
    instructors : [ { name : ''}],
    meetTimes : [{
        meetBldgCode: '',
        meetRoom: '',
        meetBuilding: '',
        meetDays: [],
        meetNo: '',
        meetPeriodBegin: '',
        meetPeriodEnd: '',
        meetTimeBegin: "12:00 AM",
        meetTimeEnd: "12:00 AM"
    }],
    nextMeetTimeIdx: 0,
    number: ''
};


let nullCourse : ICourseInfo = {
    cNote: "",
    code: "",
    name: "",
    sections: [
        nullSection
    ],
    nextSectionIdx: 0,
    termInd: ""
};