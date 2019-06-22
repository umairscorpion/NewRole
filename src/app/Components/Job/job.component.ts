import { Component, OnInit, ViewChild, ChangeDetectorRef, HostBinding } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SideNavService } from '../SideNav/sideNav.service';
import { MatDialog } from '@angular/material';
import { CommunicationService } from '../../Services/communication.service';
import { PopupDialogForJobDetail } from './popus/jobDetail.component';
import { UserSession } from '../../Services/userSession.service';
import { MyJobsComponent } from './SubPages/MyJobs/myJobs.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { AvailableJobsComponent } from './SubPages/AvailableJobs/availableJobs.component';
import { AuditFilter } from '../../Model/auditLog';
import { AuditLogService } from '../../Services/audit_logs/audit-log.service';

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
    insertAbsencesLogView: any;

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        public matDialog: MatDialog,
        private _communicationService: CommunicationService,
        private _userSession: UserSession,
        private sideNavService: SideNavService,
        private auditLogService: AuditLogService) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    AvailableJobCounter($event) {
        this.available = $event
        this.upcomingJobs.GetUpcommingJobs();
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
        const config = {
            resourceTypeId: 2,
            parentResourceTypeId: -1,
            isAdminPanel: 0
        }
        this._communicationService.UpdatePanel(config);
    }

    JobDetail(data: any) {
        this.matDialog.closeAll();
        this.matDialog.open(PopupDialogForJobDetail, {
            data,
            height: '550px',
            width: '650px',
            panelClass: 'AbsenceDetail-popup',
        });
        const model = new AuditFilter();
        model.entityId = data.absenceId;
        this.auditLogService.insertAbsencesLogView(model).subscribe((result: any) => {
            this.insertAbsencesLogView = result;
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}