import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuditLogService } from '../../Services/audit_logs/audit-log.service';
import { AuditFilter } from '../../Model/auditLog';

@Component({
    selector: 'app-audit-log',
    templateUrl: './audit-log.component.html',
    styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {
    noAbsenceMessage = true;
    auditLog: any;
    auditLogFilter: FormGroup;
    searchEmployeeName: string = '';

    constructor(
        private auditLogService: AuditLogService,
        private _formBuilder: FormBuilder) {
        const curr = new Date;
        const first = curr.getDate();
        const last = first;
        this.auditLogFilter = this._formBuilder.group({
            date: [{ begin: new Date(curr.setDate(first)), end: new Date(curr.setDate(last)) }],
            searchEmployeeName: ['']
        });
    }

    ngOnInit(): void {
        this.getAuditLog();
    }

    ngAfterViewInit(): void {
    }

    getAuditLog() {
        const model = new AuditFilter();
        model.startDate = this.auditLogFilter.get('date').value['begin'];
        model.endDate = this.auditLogFilter.get('date').value['end'];
        model.searchByEmployeeName = this.auditLogFilter.get('searchEmployeeName').value;
        this.auditLogService.getAuditView(model).subscribe((availabilities: any) => {
            this.auditLog = availabilities;
        });
    }
}
