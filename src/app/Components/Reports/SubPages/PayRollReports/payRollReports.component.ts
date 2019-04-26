import { Component, OnInit, ViewChild, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { ReportService } from 'src/app/Services/report.service';
import * as moment from 'moment';
import { LeaveRequest } from 'src/app/Model/leaveRequest';
import { UserSession } from 'src/app/Services/userSession.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportFilter } from 'src/app/Model/Report/report.filter';

@Component({
    selector: 'payroll-reports',
    templateUrl: 'payRollReports.component.html'
})
export class PayRollReportsComponent implements OnInit, AfterViewInit {

    currentDate: Date = new Date();
    msg: string;
    indLoading = false;
    modalTitle: string;
    modalBtnTitle: string;
    date: string = moment().format('dddd, MM/DD/YYYY');
    noAbsenceMessage = true;
    submitted = false;
    reportFilterForm: FormGroup;
    submittedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    approvedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    deniedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    archivedDeniedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    archivedApprovedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();

    constructor(
        private reportService: ReportService,
        private fb: FormBuilder,
    ) {
        this.reportFilterForm = this.initReportFilters();
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.GetLeaveRequests();
    }

    initReportFilters() {
        return ReportFilter.CreateFilterFormGroup(this.fb);
      }

    GetLeaveRequests(): void {
        const filters = ReportFilter.initial();
        this.reportService.getLeaveRequests(filters).subscribe((leaveRequests: LeaveRequest[]) => {
            this.bindData(leaveRequests);
        },
            error => this.msg = <any>error);
    }

    applyFilter(formGroup: FormGroup): void {
        const filters = ReportFilter.initial();
        filters.fromDate = moment(formGroup.value.fromDate).format('dddd, MM/DD/YYYY');
        filters.toDate = moment(formGroup.value.toDate).format('dddd, MM/DD/YYYY');
        filters.jobNumber = formGroup.value.jobNumber;
        this.reportService.getLeaveRequests(filters).subscribe((leaveRequests: LeaveRequest[]) => {
            this.bindData(leaveRequests);
        },
            error => this.msg = <any>error);
    }

    bindData(leaveRequests: LeaveRequest[]) {
        this.submittedLeaveRequests = leaveRequests.filter(t => t.isApproved === false && t.isDeniend === false);
    }
}
