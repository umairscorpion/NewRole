import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ReportService } from 'src/app/Services/report.service';
import * as moment from 'moment';
import { LeaveRequest } from 'src/app/Model/leaveRequest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportFilter } from 'src/app/Model/Report/report.filter';
import { ExcelService } from 'src/app/Services/excel.service';
import { AuditFilter } from 'src/app/Model/auditLog';
import { AuditLogService } from 'src/app/Services/audit_logs/audit-log.service';

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
    activityReport: LeaveRequest[] = Array<LeaveRequest>();
    auditLogsAbsences: any;
    constructor(
        private auditLogService: AuditLogService,
        private reportService: ReportService,
        private fb: FormBuilder,
        private excelService: ExcelService
    ) {
        this.reportFilterForm = this.initReportFilters();
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.loadAudit();
    }

    initReportFilters() {
        return ReportFilter.CreateFilterFormGroup(this.fb);
    }

    loadAudit(): void {
        const model = new AuditFilter();
        model.startDate =  moment(this.reportFilterForm.get('fromDate').value).format('dddd, MM/DD/YYYY');
        model.endDate = moment(this.reportFilterForm.get('toDate').value).format('dddd, MM/DD/YYYY');
        model.entityId  = this.reportFilterForm.get('jobNumber').value;
        this.auditLogService.getAbsencesAuditView(model).subscribe((result: any) => {
            this.auditLogsAbsences = result;
        });
    }

    onDownload(formGroup: FormGroup) {
        const model = new AuditFilter();
        model.startDate =  moment(this.reportFilterForm.get('fromDate').value).format('dddd, MM/DD/YYYY');
        model.endDate = moment(this.reportFilterForm.get('toDate').value).format('dddd, MM/DD/YYYY');
        model.entityId  = this.reportFilterForm.get('jobNumber').value;
        this.auditLogService.getAbsencesAuditView(model).subscribe((result: any) => {
            this.activityReport = result;
            this.excelService.exportAsExcelFile(this.activityReport, 'ActivityReport');
        });
    }
}
