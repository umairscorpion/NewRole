import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DataContext } from '../../../../Services/dataContext.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunicationService } from '../../../../Services/communication.service';
import { UserSession } from '../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { PopupDialogForRunningLate } from '../../popus/runningLate.component';
import { ReleasePopupComponent } from '../../popus/release-popup/release-popup.component';

@Component({
    selector: 'my-jobs',
    templateUrl: 'myJobs.component.html',
    styleUrls: ['myJobs.component.scss']
})
export class MyJobsComponent implements OnInit {
    UpcomingJobCount: any;
    @Output() UpcomingCountEvent = new EventEmitter<string>();
    Organizations: any;
    Districts: any;
    CurrentDate: Date = new Date;
    private notifier: NotifierService;
    FilterForm: FormGroup;
    UpcommingJobs = new MatTableDataSource();
    msg: string;
    currentDate: Date = new Date();
    displayedColumns = ['AbsenceDate', 'JobId', 'Posted', 'Location', 'Employee', 'Status', 'Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    FileStream: any;
    UserClaim: any;

    constructor(
        private _dataContext: DataContext,
        private _userSession: UserSession,
        private _formBuilder: FormBuilder,
        public dialog: MatDialog,
        notifier: NotifierService,
        private _communicationService: CommunicationService,
        private activatedRoute: ActivatedRoute,
        private dialogRef: MatDialog) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.jobId && params.ac == 1) {
                this.AcceptJob(params.jobId, 'Email');
            }
        })
        this.FilterForm = this._formBuilder.group({
            FilterStartDate: ['', Validators.required],
            FilterEndDate: ['', Validators.required],
            DistrictId: ['', Validators.required],
            OrganizationId: ['-1', Validators.required]
        });
        this.UserClaim = JSON.parse(localStorage.getItem('userClaims'));
        this.FilterForm.get('DistrictId').setValue(this.UserClaim.districtName);
        this.FilterForm.controls['DistrictId'].disable();
        this.GetUpcommingJobs();
        this.GetOrganizations(this._userSession.getUserDistrictId());
    }

    ngAfterViewInit() {
        this.UpcommingJobs.sort = this.sort;
        this.UpcommingJobs.paginator = this.paginator;
    }

    GetUpcommingJobs() {
        let EndDate = new Date();
        EndDate.setDate(this.currentDate.getDate() + 30);
        let model = {
            StartDate: this.CurrentDate.toISOString(),
            EndDate: EndDate.toISOString(),
            SubstituteId: this._userSession.getUserId(),
            DistrictId: this._userSession.getUserDistrictId(),
            Status: 2,
        }
        this.FilterForm.get('FilterStartDate').setValue(this.CurrentDate);
        this.FilterForm.get('FilterEndDate').setValue(EndDate);
        this._dataContext.post('Job/getAvailableJobs', model).subscribe((data: any) => {
            this.UpcommingJobs.data = data;
            this.UpcomingJobCount = data.length
            this.UpcomingCountEvent.emit(this.UpcomingJobCount)
        },
            error => this.msg = <any>error);
    }

    ReleaseJob(SelectedRow: any, StatusId: number) {
        const dialog = this.dialogRef.open(
            ReleasePopupComponent, {
            panelClass: 'release-decline-dialog'
        }
        );
        dialog.afterClosed().subscribe(result => {
            if (result != null) {
                let currentTime = moment();
                let currentDate = moment().format('YYYY MM DD');
                let starttime = moment(SelectedRow.startTime, 'h:mma');
                let endtime = moment(SelectedRow.endTime, 'h:mma');
                let startdate = moment(SelectedRow.startDate).format('YYYY MM DD');
                if (currentDate == startdate) {
                    if (currentTime > endtime) {
                        this.notifier.notify('error', 'Job has ended, unable to release.');
                    }
                    else if (currentTime > starttime) {
                        this.notifier.notify('error', 'Job has started, unable to release.');
                    }
                    else {
                        if ((SelectedRow.startDate as Date) <= this.currentDate) {
                            this.notifier.notify('error', 'Not able to release now.');
                            return;
                        }
                        let model = {
                            ConfirmationNumber: SelectedRow.confirmationNumber,
                            AbsenceId: SelectedRow.absenceId,
                            Status: StatusId,
                            EmployeeId: this._userSession.getUserId(),
                            CreatedDate: this.currentDate.toISOString(),
                            ForReason: true,
                            ReasonId: result.reasonId,
                            ReasonText: result.reasonText
                        }
                        this._dataContext.UpdateAbsenceStatus('Absence/UpdateAbsenceReasonStatus', model).subscribe((response: any) => {
                            if (response == "success") {
                                this.notifier.notify('success', 'Released Successfully.');
                                this.GetUpcommingJobs();
                            }
                        },
                            error => this.msg = <any>error);
                    }
                }
                else {
                    if (startdate > currentDate) {
                        if ((SelectedRow.startDate as Date) <= this.currentDate) {
                            this.notifier.notify('error', 'Not able to Release now.');
                            return;
                        }
                        let model = {
                            ConfirmationNumber: SelectedRow.confirmationNumber,
                            AbsenceId: SelectedRow.absenceId,
                            Status: StatusId,
                            EmployeeId: this._userSession.getUserId(),
                            CreatedDate: this.currentDate.toISOString(),
                            ForReason: true,
                            ReasonId: result.reasonId,
                            ReasonText: result.reasonText
                        }
                        this._dataContext.UpdateAbsenceStatus('Absence/UpdateAbsenceReasonStatus', model).subscribe((response: any) => {
                            if (response == "success") {
                                this.notifier.notify('success', 'Released Successfully.');
                                this.GetUpcommingJobs();
                            }
                        },
                            error => this.msg = <any>error);
                    }
                    else {
                        this.notifier.notify('error', 'Something Went Wrong.');
                    }
                }
            }
            else {
                this.notifier.notify('error', 'Something Went Wrong.');
            }
        });
    }

    ngOnChanges() {
        alert("Inti");
    }

    GetOrganizations(DistrictId: number): void {
        this._dataContext.getById('School/getOrganizationsByDistrictId', DistrictId).subscribe((data: any) => {
            this.Organizations = data;
        },
            error => <any>error);
    }

    SearchUpcommingJobs(SearchFilter: any): void {
        let model = {
            StartDate: SearchFilter.value.FilterStartDate.toISOString(),
            EndDate: SearchFilter.value.FilterEndDate.toISOString(),
            SubstituteId: this._userSession.getUserId(),
            DistrictId: this._userSession.getUserDistrictId(),
            Status: 2,
            OrganizationId: SearchFilter.value.OrganizationId
        }
        if (this.FilterForm.valid) {
            this._dataContext.post('Job/getAvailableJobs', model).subscribe((data: any) => {
                this.UpcommingJobs.data = data;
                this.UpcomingJobCount = data.length
                this.UpcomingCountEvent.emit(this.UpcomingJobCount)
            },
                error => this.msg = <any>error);
        }
    }

    ShowJobDetail(AbsenceDetail: any) {
        AbsenceDetail.isShowAttachment = false;
        this._communicationService.ViewAbsenceDetail(AbsenceDetail);
    }

    ShowRuningLate(AbsenceDetail: any) {
        this.dialog.open(PopupDialogForRunningLate, {
            data: AbsenceDetail,
            height: '410px',
            width: '350px',
        });
    }

    AcceptJob(jobNo: number, via: string) {
        let confirmResult = confirm('Are you sure you want to Accept this Job?');
        if (confirmResult) {
            this._dataContext.get('Job/acceptJob/' + jobNo + "/" + this._userSession.getUserId() + "/" + via).subscribe((response: any) => {
                this.NotifyResponse(response as string);
                this.GetUpcommingJobs();
            },
                error => this.msg = <any>error);
        }
    }

    NotifyResponse(Message: string): void {
        if (Message == "success") {
            this.notifier.notify('success', 'Accepted Successfully.');
            this.GetUpcommingJobs();
        }
        else if (Message == "Blocked") {
            this.notifier.notify('error', 'You Are Blocked By Employee To Accept This Job.');
            this.GetUpcommingJobs();
        }
        else if (Message == "Cancelled") {
            this.notifier.notify('error', 'Job Has Been Cancelled.');
            this.GetUpcommingJobs();
        }
        else if (Message == "Accepted") {
            this.notifier.notify('error', 'Job Already Accepted.');
            this.GetUpcommingJobs();
        }
        else if (Message == "Conflict") {
            this.notifier.notify('error', 'Already Accepted Job on This Date.');
            this.GetUpcommingJobs();
        }
        else {
            this.notifier.notify('error', 'Problem Occured While Process you Request. Please Try Again Later.');
        }
    }
}