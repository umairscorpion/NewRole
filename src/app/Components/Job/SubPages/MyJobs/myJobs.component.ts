import { Component, ViewChild, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DataContext } from '../../../../Services/dataContext.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunicationService } from '../../../../Services/communication.service';
import { UserSession } from '../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../Service/user.service';
import { environment } from '../../../../../environments/environment.prod';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector:'my-jobs',
    templateUrl: 'myJobs.component.html'
})
export class MyJobsComponent implements OnInit {
    Organizations: any;
    Districts : any;
    CurrentDate: Date = new Date;
    private notifier: NotifierService;
    FilterForm: FormGroup;
    UpcommingJobs = new MatTableDataSource();
    msg: string;
    currentDate: Date = new Date();
    displayedColumns = ['AbsenceDate', 'Posted', 'Location', 'Status', 'Substitute', 'Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    FileStream: any;

    constructor(private _dataContext: DataContext, private _userSession: UserSession,
         private _formBuilder: FormBuilder, private userService : UserService, private router: Router,
        notifier: NotifierService, private _communicationService: CommunicationService, private activatedRoute: ActivatedRoute) {
        this.notifier = notifier;
    }

    ngAfterViewInit() {
        this.UpcommingJobs.sort = this.sort;
        this.UpcommingJobs.paginator = this.paginator;
    }

    GetUpcommingJobs() {
        let StartDate = this.CurrentDate.toISOString();
        let EndDate = new Date();
        EndDate.setDate(this.currentDate.getDate() + 30);
        let UserId = this._userSession.getUserId();
        let DistrictId = this._userSession.getUserDistrictId();
        let Status = 2 ;
        this.FilterForm.get('FilterStartDate').setValue(this.CurrentDate);
        this.FilterForm.get('FilterEndDate').setValue(EndDate);
        this._dataContext.get('Job/getAvailableJobs' + "/" + StartDate + "/" + EndDate.toISOString() +
         "/" + UserId + "/"+ "-1" + "/" + DistrictId + "/" + Status ).subscribe((data: any) => {
            this.UpcommingJobs.data = data;
        },
            error => this.msg = <any>error);
    }

    ReleaseJob(SelectedRow: any, StatusId: number) {
        let confirmResult = confirm('Are you sure you want to release this job?');
        if (confirmResult) {
            if ((SelectedRow.startDate as Date) <= this.currentDate)
            { this.notifier.notify('error','Not aBle to release now') ; return;}
            this._dataContext.UpdateAbsenceStatus('Absence/updateAbseceStatus', SelectedRow.absenceId, StatusId, this.currentDate.toISOString(), this._userSession.getUserId()).subscribe((response: any) => {
                if (response == "success") {
                    this.notifier.notify('success', 'Released Successfully.');
                    this.GetUpcommingJobs();
                }
            },
                error => this.msg = <any>error);
        }
    }

    ngOnChanges()	{
        alert("Inti");
    }


    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.jobId) {
                this.AcceptJob(params.jobId)
            }
        })
        this.FilterForm = this._formBuilder.group({
            FilterStartDate: ['', Validators.required],
            FilterEndDate: ['', Validators.required],
            DistrictId: [{ disabled: true}, Validators.required],
            OrganizationId: ['-1', Validators.required]
        });
        this.GetUpcommingJobs();
        this.GetDistricts();
        this.GetOrganizations(this._userSession.getUserDistrictId());
        
    }

    GetOrganizations(DistrictId: number): void {
        this._dataContext.getById('School/getOrganizationsByDistrictId', DistrictId).subscribe((data: any) => {
            this.Organizations = data;
            // if (typeof this._userSession.getUserOrganizationId() != "undefined" && this._userSession.getUserOrganizationId() != "-1" && this._userSession.getUserOrganizationId())
            //     // this.absenceFirstFormGroup.get('OrganizationId').setValue(this._userSession.getUserOrganizationId());
            // this.absenceFirstFormGroup.controls['OrganizationId'].enable();
            // if (this._userSession.getUserRoleId() == 5) {
            //     this.absenceFirstFormGroup.get['OrganizationId'].setValue(this.Organizations[0].schoolId);
            // }
            // else {
            //     this.absenceFirstFormGroup.controls['OrganizationId'].disable();
            // }
        },
            error => <any>error);
    }

    GetDistricts(): void {
        this._dataContext.get('district/getDistricts').subscribe((data: any) => {
            this.Districts = data;
                this.FilterForm.get('DistrictId').setValue(this._userSession.getUserDistrictId());
                this.FilterForm.controls['DistrictId'].disable();
        },
            error => <any>error);
    }

    SearchUpcommingJobs(SearchFilter: any): void {
        if (this.FilterForm.valid) {
            this._dataContext.get('Job/getAvailableJobs' + "/" + SearchFilter.value.FilterStartDate.toISOString() + "/" 
            + SearchFilter.value.FilterEndDate.toISOString() + "/" + this._userSession.getUserId() + "/"+ SearchFilter.value.OrganizationId + 
            "/" + SearchFilter.getRawValue().DistrictId  + "/" + 2 ).subscribe((data: any) => {
            this.UpcommingJobs.data = data;
        },
            error => this.msg = <any>error);
        }
    }

    ShowJobDetail(AbsenceDetail: any) {
        AbsenceDetail.isShowAttachment = false;
        this._communicationService.ViewAbsenceDetail(AbsenceDetail);
    
    }

    AcceptJob(jobNo : number) {
        let confirmResult = confirm('Are you sure you want to Accept this Job?');
        if (confirmResult) {
            this._dataContext.get('Job/acceptJob/' + jobNo + "/" + this._userSession.getUserId() + "/" + "WebApp").subscribe((response: any) => {
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
            this.notifier.notify('error', 'Problem Occured While Process you Request.Please Try Again Later.');
        }
    }

}