import { Component, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { TimeClockService } from '../../Services/timeClock.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material';
import { SideNavService } from '../SideNav/sideNav.service';
import { UserSession } from '../../Services/userSession.service';
import { OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeClock } from '../../Model/timeclock'
import * as moment from 'moment';
import { DataContext } from '../../Services/dataContext.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimeClockFilter } from '../../Model/timeclock.filter';

@Component({
    // selector:'time-clock',
    templateUrl: 'timeClock.component.html',
    styleUrls: ['timeClock.component.scss']
})
export class TimeClockComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    totalMinutes: any;
    totalBreaks: any;
    withoutBreaks: any;
    noDataMessage = true;
    totalTimeInHours: any;
    totalTimeInMinutes: any;
    totalBreakTimeInHours: any;
    totalBreakTimeInMinutes: any;

    totalWithoutBreakTimeInHours: any;
    totalWithoutBreakTimeInMinutes: any;

    totalLength:any;

    date: string = moment().format('dddd, MM/DD/YYYY');
    time: string = moment().format('h:mma');
    displayedColumns = ['Date', 'Clockin', 'Clockout','activity', 'Length', 'Break','Status'];
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;
    substituteDataSource = new MatTableDataSource();
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    private notifier: NotifierService;
    sideNavMenu: any;
    isOpen = true;
    userRole: number = this._userSession.getUserRoleId();
    startDate: string = moment().format('dddd, MM/DD/YYYY');
    startTime: string = moment().format('h:mma');
    userId: string = this._userSession.getUserId();
    timeClockDetail = new MatTableDataSource();
    private timeClockFormGroup: FormGroup;
    CurrentDate: Date = new Date;
    totalBreaksForTimeSheet: any;
    withoutBreakTime: any;

    constructor(
        private _userService: UserService,
        public dialog: MatDialog,
        private dataContext: DataContext,
        private _formBuilder: FormBuilder,
        private sideNavService: SideNavService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private _userSession: UserSession,
        private timeClockService: TimeClockService,
        notifier: NotifierService) {
        this.notifier = notifier;
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.GetTimeClockDataWithFilter();
        this.LoadSideNavMenu();
        this.GenerateForms();
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });
    }

    ngAfterViewInit() {
        this.timeClockDetail.sort = this.sort;
        this.timeClockDetail.paginator = this.paginator;
    }

    LoadSideNavMenu(): void {
        let resourceTypeId = 2;
        let parentResourceTypeId = -1;
        let adminPortal = 0;
        this._userService.getUserResources(resourceTypeId, parentResourceTypeId, adminPortal).subscribe((data: any) => {
            this.sideNavMenu = data;
        },
            error => this.msg = <any>error);
    }

    GenerateForms(): void {
        this.timeClockFormGroup = this._formBuilder.group({
            viewDataBy: ['1']
        });
    }

    checkTimeClock(): boolean {
        return this.timeClockFormGroup.get('viewDataBy').value != "2" ? true : false;
    }

    clockInClick() {
        this.dataContext.get('Time/Timeclockstatus').subscribe((respose: any) => {
            if (respose == 'Clock In' || respose == 'Return') {
                this.notifier.notify('error', 'Already Clock In.');
                this.GetTimeClockDataWithFilter();
            }
            else if (respose == 'Break') {
                this.timeClockService.return('Time/Return', this.userId).subscribe((respose: any) => {
                    if (respose == 1) {
                        this.notifier.notify('success', 'Return Successfully.');
                        this.GetTimeClockDataWithFilter();
                    }
                },
                    (err: HttpErrorResponse) => {
                    });
            }
            else {
                this.timeClockService.clockin('Time/ClockIn', this.userId).subscribe((respose: any) => {
                    if (respose == 1) {
                        this.notifier.notify('success', 'Clock In Successfully.');
                        this.GetTimeClockDataWithFilter();
                    }
                },
                    (err: HttpErrorResponse) => {
                    });
            }

        },
            (err: HttpErrorResponse) => {
            });
    }

    breakClick() {
        this.dataContext.get('Time/Timeclockstatus').subscribe((respose: any) => {
            if (respose == 'Break') {
                this.notifier.notify('error', 'Already On Break.');
                this.GetTimeClockDataWithFilter();
            }
            else if (respose == 'Clock Out') {
                this.notifier.notify('error', 'Please Clock In First.');
                this.GetTimeClockDataWithFilter();
            }
            else {
                this.timeClockService.break('Time/Break', this.userId).subscribe((respose: any) => {
                    if (respose == 1) {
                        this.notifier.notify('success', 'On Break.');
                        this.GetTimeClockDataWithFilter();
                    }
                },
                    (err: HttpErrorResponse) => {
                    });
            }

        },
            (err: HttpErrorResponse) => {
            });
    }

    returnClick() {
        this.timeClockService.return('Time/Return', this.userId).subscribe((respose: any) => {
            if (respose == 1) {
                this.notifier.notify('success', 'Return Successfully.');
            }
        },
            (err: HttpErrorResponse) => {
            });
    }

    clockOutClick() {
        this.dataContext.get('Time/Timeclockstatus').subscribe((respose: any) => {
            if (respose == 'Clock Out') {
                this.notifier.notify('error', 'Please Clock In First.');
                this.GetTimeClockDataWithFilter();
            }
            else if (respose == null)
            {
                this.notifier.notify('error', 'Please Clock In First.');
                this.GetTimeClockDataWithFilter();
            }
            else if (respose == 'Break')
            {
                this.notifier.notify('error', 'Already On Break.');
                this.GetTimeClockDataWithFilter();
            }
            else {
                this.timeClockService.clockout('Time/Clockout', this.userId).subscribe((respose: any) => {
                    if (respose == 1) {
                        this.notifier.notify('success', 'Clock Out Successfully.');
                        this.GetTimeClockDataWithFilter();
                    }
                },
                    (err: HttpErrorResponse) => {
                    });
            }

        },
            (err: HttpErrorResponse) => {
            });
    }

    GetTimeClockData() {
        this.timeClockService.TimeClockData('Time/timeclockdata').subscribe((data: TimeClock[]) => {
            this.timeClockDetail.data = data;
            this.totalMinutes =  data.map((t: TimeClock) => t.totalMinutes).reduce((acc, value) => acc + value, 0);
            this.totalBreaksForTimeSheet = data.map((t: TimeClock) => t.totalBreakTime).reduce((acc, value) => acc + value, 0);
        },
            error => this.msg = <any>error);
    }

    GetTimeClockDataWithFilter() {
        const filters = TimeClockFilter.initial();
        filters.isDaysSelected = 0;
        filters.startDate = moment().subtract(7, 'days').toISOString();
        filters.endDate = moment(new Date()).toISOString();
        this.timeClockService.getTimeClockSummary(filters).subscribe((data: TimeClock[]) => {
            this.timeClockDetail.data = data;
            if(this.timeClockDetail.data.length == 0)
            {
                this.noDataMessage = true;
            }
            else
            {
                this.noDataMessage = false;
            }
            this.totalMinutes = data.map((t: TimeClock) => t.totalMinutes).reduce((acc, value) => acc + value, 0);
            this.totalBreaksForTimeSheet = data.map((t: TimeClock) => t.totalBreakTime).reduce((acc, value) => acc + value, 0);
            this.withoutBreakTime = this.totalMinutes - this.totalBreaksForTimeSheet;
            
            this.totalTimeInHours = (this.totalMinutes/60);
            this.totalTimeInMinutes = (this.totalMinutes%60);

            this.totalBreakTimeInHours = (this.totalBreaksForTimeSheet/60);
            this.totalBreakTimeInMinutes = (this.totalBreaksForTimeSheet%60);

            this.totalWithoutBreakTimeInHours = (this.withoutBreakTime/60);
            this.totalWithoutBreakTimeInMinutes = (this.withoutBreakTime%60);
            // this.totalBreaks = data.filter((t: TimeClock) => t.status === 1).length;
            // this.withoutBreaks = data.filter((t: TimeClock) => t.status === 0).length;
        },
            error => this.msg = <any>error);
    }

    OnchangeTimeClockView(Datatype: number) {
        if (+Datatype === 1) {
            this.GetTimeClockDataWithFilter();
        }
        else {
            const filters = TimeClockFilter.initial();
            filters.isDaysSelected = 1;
            filters.startDate = moment().subtract(7, 'days').toISOString();
            filters.endDate = moment(new Date()).toISOString();
            this.timeClockService.getTimeClockSummary(filters).subscribe((data: TimeClock[]) => {
                this.timeClockDetail.data = data;
                this.totalMinutes = data.map((t: TimeClock) => t.totalMinutes).reduce((acc, value) => acc + value, 0);
                // this.totalBreaks = data.filter((t: TimeClock) => t.status === 1).length;
                // this.withoutBreaks = data.filter((t: TimeClock) => t.status === 0).length;

            },
                error => this.msg = <any>error);
        }
    }
}