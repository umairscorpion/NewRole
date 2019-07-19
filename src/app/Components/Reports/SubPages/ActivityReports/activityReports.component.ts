import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuditFilter } from '../../../../Model/auditLog';
import { AuditLogService } from '../../../../Services/audit_logs/audit-log.service';
import { ngxCsv } from 'ngx-csv';

@Component({
    selector: 'activity-reports',
    templateUrl: 'activityReports.component.html'
})
export class ActivityReportsComponent implements OnInit, AfterViewInit {
    noAbsenceMessage = true;
    reportFilterForm: FormGroup;
    activityReport: AuditFilter[] = Array<AuditFilter>();
    auditLogsAbsences: any;
    activityReportFilter: FormGroup;
    jobNumber: string = '';

    constructor(
        private auditLogService: AuditLogService,
        private _formBuilder: FormBuilder) {
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
        model.startDate = moment(this.activityReportFilter.get('date').value['begin']).format('dddd, MM/DD/YYYY');
        model.endDate = moment(this.activityReportFilter.get('date').value['end']).format('dddd, MM/DD/YYYY');
        model.entityId = this.activityReportFilter.get('jobNumber').value;
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
            headers: ['Absence ID', 'Posted By', 'Updated By', 'Approved By', 'Accepted By', 'Assigned By', 'Released By', 'Denied By', 'Declined By', 'Cancelled By']
        };
        this.auditLogsAbsences = this.auditLogsAbsences.filter(function (result) {
            delete result.substituteName;
            delete result.entityType;
            return true;
        });
        new ngxCsv(JSON.stringify(this.auditLogsAbsences), new Date().toLocaleDateString(), configuration);
    }
}
