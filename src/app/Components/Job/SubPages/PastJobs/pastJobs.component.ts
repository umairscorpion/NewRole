import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { DataContext } from '../../../../Services/dataContext.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunicationService } from '../../../../Services/communication.service';
import { UserSession } from '../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'past-jobs',
    templateUrl: 'pastJobs.component.html',
    styleUrls: ['pastJobs.component.scss']
})
export class PastJobsComponent implements OnInit {

    PastJobCount: any;
    @Output() PastCountEvent = new EventEmitter<string>();
    Organizations: any;
    Districts: any;
    CurrentDate: Date = new Date;
    private notifier: NotifierService;
    FilterForm: FormGroup;
    PastJobs = new MatTableDataSource();
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
        notifier: NotifierService,
        private _communicationService: CommunicationService) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.FilterForm = this._formBuilder.group({
            FilterStartDate: ['', Validators.required],
            FilterEndDate: ['', Validators.required],
            DistrictId: ['', Validators.required],
            OrganizationId: ['-1', Validators.required]
        });
        this.UserClaim = JSON.parse(localStorage.getItem('userClaims'));
        this.FilterForm.get('DistrictId').setValue(this.UserClaim.districtName);
        this.FilterForm.controls['DistrictId'].disable();
        this.GetPastJobs();
        this.GetOrganizations(this._userSession.getUserDistrictId());
    }

    ngAfterViewInit() {
        this.PastJobs.sort = this.sort;
        this.PastJobs.paginator = this.paginator;
    }

    GetPastJobs() {
        let StartDate = new Date();
        let EndDate = this.CurrentDate.toISOString();
        StartDate.setDate(this.currentDate.getDate() - 30);
        let model = {
            StartDate: StartDate.toISOString(),
            EndDate: EndDate,
            SubstituteId: this._userSession.getUserId(),
            DistrictId: this._userSession.getUserDistrictId(),
            Status: 2,
        }
        this.FilterForm.get('FilterStartDate').setValue(StartDate);
        this.FilterForm.get('FilterEndDate').setValue(this.CurrentDate);
        this._dataContext.post('Job/getAvailableJobs', model).subscribe((data: any) => {
            this.PastJobs.data = data;
            this.PastJobCount = data.length
            this.PastCountEvent.emit(this.PastJobCount)

        },
            error => this.msg = <any>error);
    }

    GetOrganizations(DistrictId: number): void {
        this._dataContext.getById('School/getOrganizationsByDistrictId', DistrictId).subscribe((data: any) => {
            this.Organizations = data;
        },
            error => <any>error);
    }

    SearchPastJobs(SearchFilter: any): void {
        if (this.FilterForm.valid) {
            let model = {
                StartDate: SearchFilter.value.FilterStartDate.toISOString(),
                EndDate: SearchFilter.value.FilterEndDate.toISOString(),
                SubstituteId: this._userSession.getUserId(),
                DistrictId: this._userSession.getUserDistrictId(),
                Status: 2,
                Requested: false,
                OrganizationId: SearchFilter.value.OrganizationId
            }
            this._dataContext.post('Job/getAvailableJobs', model).subscribe((data: any) => {
                this.PastJobs.data = data;
                this.PastJobCount = data.length
                this.PastCountEvent.emit(this.PastJobCount)
            },
                error => this.msg = <any>error);
        }
    }

    ShowJobDetail(AbsenceDetail: any) {
        AbsenceDetail.isShowAttachment = false;
        this._communicationService.ViewAbsenceDetail(AbsenceDetail);
    }
}