import { Component, OnInit, ViewChild, ChangeDetectorRef, HostBinding, Inject } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { SideNavService } from '../SideNav/sideNav.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CommunicationService } from '../../Services/communication.service';
import { PopupDialogForJobDetail } from './popus/jobDetail.component';
import { UserSession } from '../../Services/userSession.service';
import { MyJobsComponent } from './SubPages/MyJobs/myJobs.component';
import { AfterViewInit } from '@angular/core';
import { Input, ChangeDetectionStrategy } from '@angular/core';
import { AvailableJobsComponent } from './SubPages/AvailableJobs/availableJobs.component';



@Component({
    templateUrl: 'job.component.html',
    styleUrls: ['job.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobComponent implements OnInit {
    @ViewChild(MyJobsComponent) private upcomingJobs: MyJobsComponent;
    @ViewChild(AvailableJobsComponent) private getavailable: AvailableJobsComponent;
    available: string;
    upcoming: string;
    past: string;
    sideNavMenu: any;
    msg: string;
    isOpen = true;
    userRole: number = this._userSession.getUserRoleId();
    @HostBinding('class.is-open')
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    constructor(private router: Router, private _userService: UserService, changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher, public matDialog: MatDialog, private _communicationService: CommunicationService,
        cdRef: ChangeDetectorRef,
        private _userSession: UserSession,
        private sideNavService: SideNavService) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
    AvailableJobCounter($event) {
        this.available = $event
        this.upcomingJobs.GetUpcommingJobs();
        // this.getavailable.GetAvailableJobs();
    }
    UpcomingJobCounter($event) {
        this.upcoming = $event
    }
    PastJobCounter($event) {

        this.past = $event
    }
    ngOnInit(): void {
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });


        this._communicationService.AbsenceDetail.subscribe((AbsenceDetail: any) => {
            this.JobDetail(AbsenceDetail);
        });
        this.LoadSideNavMenu();
    }
    onTabChange(tabIndex: any) {
        if (tabIndex.index == 0) {
            this.getavailable.GetAvailableJobs();
        }
    }
    LoadSideNavMenu(): void {
        let resourceTypeId = 2;
        let parentResourceTypeId = -1;
        this._userService.getUserResources(resourceTypeId, parentResourceTypeId, 0).subscribe((data: any) => {
            this.sideNavMenu = data;
        },
            error => this.msg = <any>error);
    }

    JobDetail(data: any) {
        this.matDialog.closeAll();
        this.matDialog.open(PopupDialogForJobDetail, {
            data,
            height: '600px',
            width: '750px',
            panelClass: 'AbsenceDetail-popup',
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

}