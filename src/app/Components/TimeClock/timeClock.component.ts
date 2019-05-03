import { Component, ChangeDetectorRef, HostBinding, Inject } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
// import {TimeClockService} from 'src/app/Services/timeClock.service'
import { TimeClockService } from '../../Services/timeClock.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SideNavService } from '../SideNav/sideNav.service';
import { CommunicationService } from '../../Services/communication.service';
import { UserSession } from '../../Services/userSession.service';
import { OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import {TimeClock} from 'src/app/Model/timeclock'
import * as moment from 'moment';
import { EmployeeService } from 'src/app/Service/Manage/employees.service';
@Component({
    // selector:'time-clock',
    templateUrl: 'timeClock.component.html'
})
export class TimeClockComponent implements OnInit {
     @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    date: string = moment().format('dddd, MM/DD/YYYY');
    time: string = moment().format('h:mma');
    displayedColumns = ['Date', 'Clockin', 'Clockout','Length', 'Break'];
    displayedColumnsForTimeTracker: string[] = ['Date', 'Employee', 'Location', 'Clockin', 'Clockout', 'Duration', 'Break', 'Action'];
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
    // clockInButton: boolean = false;
    // clockOutButton: boolean = true;
    // BreakButton: boolean = true;
    // ReturnButton: boolean = true;
    // showReturnButton: boolean = false;
    // showBreakButton: boolean = true;

    constructor(private router: Router, private _userService: UserService, public dialog: MatDialog,
        private sideNavService: SideNavService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
        private _userSession: UserSession, private _dataContext: TimeClockService, notifier: NotifierService,
        private _communicationService: CommunicationService, private employeeService: EmployeeService) {
        this.notifier = notifier;
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
    ngOnInit(): void {
        //this.GetSustitutes();
        this.GetTimeClockData();
        this.LoadSideNavMenu();
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });
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

    GetSustitutes(): void {
        let RoleId = 4;
        let OrgId = -1;
        let DistrictId = this._userSession.getUserDistrictId();
        this.employeeService.get('user/getUsers', RoleId, OrgId, DistrictId).subscribe((data: any) => {
          this.substituteDataSource.data = data;
        },
          error => this.msg = <any>error);
      }

    clockInClick() {
        // this.clockInButton = true;
        // this.clockOutButton = false;
        // this.BreakButton = false;
        // this.ReturnButton = true;
        // this.showReturnButton = false;
        // this.showBreakButton = true;
        

        let userId = this._userSession.getUserId();
        this._dataContext.clockin('Time/ClockIn', this.userId).subscribe((respose: any) => {
            if (respose == 1) {
                this.notifier.notify('success', 'Clock In Successfully.');
                this.GetTimeClockData();
            }
        },
            (err: HttpErrorResponse) => {
            });
    }

    ngAfterViewInit() {
        this.timeClockDetail.sort = this.sort;
        this.timeClockDetail.paginator = this.paginator;
      }

    breakClick() {
        // this.clockInButton = true;
        // this.clockOutButton = true;
        // this.BreakButton = true;
        // this.ReturnButton = false;
        // this.showReturnButton = true;
        // this.showBreakButton = false;
    
        this._dataContext.break('Time/Break', this.userId).subscribe((respose: any) => {
            if (respose == 1) {
                this.notifier.notify('success', 'On Break.');
                this.GetTimeClockData();
            }
        },
            (err: HttpErrorResponse) => {
            });

    }

    returnClick() {
        // this.clockInButton = true;
        // this.clockOutButton = false;
        // this.BreakButton = false;
        // this.ReturnButton = true;
        // this.showReturnButton = false;
        // this.showBreakButton = true;
        this._dataContext.return('Time/Return', this.userId).subscribe((respose: any) => {
            if (respose == 1) {
                this.notifier.notify('success', 'Return Successfully.');
            }
        },
            (err: HttpErrorResponse) => {
            });
    }

    clockOutClick() {
        // this.clockInButton = false;
        // this.clockOutButton = true;
        // this.BreakButton = true;
        // this.ReturnButton = true;
        // this.showReturnButton = false;
        // this.showBreakButton = true;
        this._dataContext.clockout('Time/Clockout', this.userId).subscribe((respose: any) => {
            if (respose == 1) {
                this.notifier.notify('success', 'Clock Out Successfully.');
                this.GetTimeClockData();
            }
        },
            (err: HttpErrorResponse) => {
            });
    }

    GetTimeClockData() {
        this._dataContext.TimeClockData('Time/timeclockdata').subscribe((data: TimeClock[]) => {
                this.timeClockDetail.data = data;    
            },
                error => this.msg = <any>error);
    }
}