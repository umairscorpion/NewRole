import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ReportService } from 'src/app/Services/report.service';
import * as moment from 'moment';
import { LeaveRequest } from 'src/app/Model/leaveRequest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportFilter } from 'src/app/Model/Report/report.filter';
import { ExcelService } from 'src/app/Services/excel.service';
import { AuditFilter } from 'src/app/Model/auditLog';
import { AuditLogService } from 'src/app/Services/audit_logs/audit-log.service';
import { ngxCsv } from 'ngx-csv';

@Component({
    selector: 'payroll-reports',
    templateUrl: 'payRollReports.component.html'
})
export class PayRollReportsComponent implements OnInit, AfterViewInit {

    noAbsenceMessage = true;
    reportFilterForm: FormGroup;
    activityReport: AuditFilter[] = Array<AuditFilter>();
    auditLogsAbsences: any;
    activityReportFilter: FormGroup;
    jobNumber: string = '';

    constructor(
        private auditLogService: AuditLogService,
        private _formBuilder: FormBuilder,
        private excelService: ExcelService
    ) {
        const curr = new Date;
        const first = curr.getDate();
        const last = first;
        this.activityReportFilter = this._formBuilder.group({
            date: [{ begin: new Date(curr.setDate(first)), end: new Date(curr.setDate(last)) }],
            jobNumber: ['']
        });
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.loadAudit();
    }

    loadAudit(): void {
        const model = new AuditFilter();
        model.startDate =  moment(this.activityReportFilter.get('date').value['begin']).format('dddd, MM/DD/YYYY');
        model.endDate = moment(this.activityReportFilter.get('date').value['end']).format('dddd, MM/DD/YYYY');
        model.entityId  = this.activityReportFilter.get('jobNumber').value;
        this.auditLogService.getAbsencesAuditView(model).subscribe((result: any) => {
            this.auditLogsAbsences = result;
        });
    }

    onExportingToCSV() {
        var configuration = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'Activity Report',
            useBom: false,
            noDownload: false,
            headers: ['Absence ID', 'Posted By', 'Approved By', 'Accepted By', 'Released By', 'Declined By', 'Cancelled By']
        };
        this.auditLogsAbsences = this.auditLogsAbsences.filter(function (result) {
            delete result.assigned;
            delete result.updated;
            delete result.substituteName;
            delete result.entityType;
            return true;
        });
        new ngxCsv(JSON.stringify(this.auditLogsAbsences), new Date().toLocaleDateString(), configuration);
    }
}
