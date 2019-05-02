import { Component, ChangeDetectorRef, HostBinding, Inject } from '@angular/core';
import { UserService } from '../../Service/user.service';
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
import * as moment from 'moment';
@Component({
    // selector:'time-clock',
    templateUrl: 'timeClock.component.html'
})
export class TimeClockComponent implements OnInit {
    date: string = moment().format('dddd, MM/DD/YYYY');
    time: string = moment().format('h:mma');
    displayedColumns = ['Date', 'Clockin', 'Clockout', 'Length', 'Break'];
    displayedColumnsForTimeTracker: string[] = ['Date', 'Employee', 'Location', 'Clockin', 'Clockout', 'Duration', 'Break', 'Action'];
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    private notifier: NotifierService;
    sideNavMenu: any;
    isOpen = true;
    userRole: number = this._userSession.getUserRoleId();
    startDate:string = moment().format('dddd, MM/DD/YYYY');
    startTime:string = moment().format('h:mma');
    userId:string = this._userSession.getUserId();
    

    constructor(private router: Router, private _userService: UserService, public dialog: MatDialog,
        private sideNavService: SideNavService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
        private _userSession: UserSession,private _dataContext: TimeClockService,notifier: NotifierService,
        private _communicationService: CommunicationService) {
            this.notifier = notifier;
            this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
         }
    ngOnInit(): void {
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

    clockInClick() {
    let userId = this._userSession.getUserId();
    this._dataContext.clockin('Time/ClockIn',this.userId).subscribe((respose: any) => {
        if (respose == 1) {
            this.notifier.notify('success', 'Clock In Successfully.');
        }
    },
    (err: HttpErrorResponse) => {
    });
}

    breakClick() {
        this._dataContext.break('Time/Break',this.userId).subscribe((respose: any) => {
            if (respose == 1) {
                this.notifier.notify('success', 'On Break.');
            }
        },
        (err: HttpErrorResponse) => {
        });
       
    }

    returnClick() {
        this._dataContext.return('Time/Return',this.userId).subscribe((respose: any) => {
            if (respose == 1) {
                this.notifier.notify('success', 'Return Successfully.');
            }
        },
        (err: HttpErrorResponse) => {
        });
    }

    clockOutClick() {
        this._dataContext.clockout('Time/Clockout',this.userId).subscribe((respose: any) => {
            if (respose == 1) {
                this.notifier.notify('success', 'Clock Out Successfully.');
            }
        },
        (err: HttpErrorResponse) => {
        });
    }
}