import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataContext } from 'src/app/Services/dataContext.service';
import { UserSession } from 'src/app/Services/userSession.service';
import { EmployeeService } from 'src/app/Service/Manage/employees.service';
import { Observable } from 'rxjs/Observable';
import { IEmployee } from 'src/app/Model/Manage/employee';
import { AuditLogService } from 'src/app/Services/audit_logs/audit-log.service';
import { AuditFilter } from 'src/app/Model/auditLog';

@Component({
    selector: 'app-audit-log',
    templateUrl: './audit-log.component.html',
    styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {

    noAbsenceMessage = true;
    auditLog: any;
    searchAuditLogsForm: FormGroup;
    Employees: Observable<IEmployee[]>;
    SearchedEmployee: string;
    searchEmployeeName: string = '';

    constructor(
        private auditLogService: AuditLogService,
        private _formBuilder: FormBuilder
    ) {
        const curr = new Date;
        const first = curr.getDate();
        const last = first;
        this.searchAuditLogsForm = this._formBuilder.group({
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
        model.startDate = this.searchAuditLogsForm.get('date').value['begin'];
        model.endDate = this.searchAuditLogsForm.get('date').value['end'];
        model.searchByEmployeeName = this.searchAuditLogsForm.get('searchEmployeeName').value;
        this.auditLogService.getAuditView(model).subscribe((availabilities: any) => {
            this.auditLog = availabilities;
        });
    }

}
