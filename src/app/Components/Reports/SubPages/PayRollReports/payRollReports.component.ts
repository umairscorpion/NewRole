import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ReportService } from 'src/app/Services/report.service';
import * as moment from 'moment';
import { LeaveRequest } from 'src/app/Model/leaveRequest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportFilter } from 'src/app/Model/Report/report.filter';
import { ExcelService } from 'src/app/Services/excel.service';

@Component({
    selector: 'payroll-reports',
    templateUrl: 'payRollReports.component.html'
})
export class PayRollReportsComponent implements OnInit, AfterViewInit {

    currentDate: Date = new Date();
    msg: string;
    date: string = moment().format('dddd, MM/DD/YYYY');
    noAbsenceMessage = true;
    reportFilterForm: FormGroup;
    submittedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    activityReport: LeaveRequest[] = Array<LeaveRequest>();

    constructor(
        private reportService: ReportService,
        private fb: FormBuilder,
        private excelService: ExcelService
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

    onDownload(formGroup: FormGroup) {
        const filters = ReportFilter.initial();
        filters.fromDate = moment(formGroup.value.fromDate).format('dddd, MM/DD/YYYY');
        filters.toDate = moment(formGroup.value.toDate).format('dddd, MM/DD/YYYY');
        filters.jobNumber = formGroup.value.jobNumber;
        this.reportService.getLeaveRequests(filters).subscribe((leaveRequests: LeaveRequest[]) => {
            this.activityReport = leaveRequests;
            this.activityReport = this.activityReport.filter(function (activityReport) {
                delete activityReport.leaveRequestId;
                delete activityReport.createdById;
                delete activityReport.employeeId;
                delete activityReport.leaveTypeId;
                delete activityReport.isApproved;
                delete activityReport.isDeniend;
                delete activityReport.leaveTypeName;
                delete activityReport.description;
                delete activityReport.createdDate;
                delete activityReport.isArchived;
                delete activityReport.totalDays;
                return true;
            });
            this.excelService.exportAsExcelFile(this.activityReport, 'ActivityReport');
        });
    }
}
