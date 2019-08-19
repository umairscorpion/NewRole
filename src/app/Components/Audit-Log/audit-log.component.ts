import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuditLogService } from '../../Services/audit_logs/audit-log.service';
import { AuditFilter } from '../../Model/auditLog';
import { moment } from 'fullcalendar';
import { DataContext } from 'src/app/Services/dataContext.service';
import { UserSession } from 'src/app/Services/userSession.service';

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
    loginedUserRole: any;
    loginedUserDistrictId: any;
    loginedUserSchoolId: any;
    Districts: any;
    Organizations: any;
    DistrictId: any;

    constructor(
        private auditLogService: AuditLogService,
        private _formBuilder: FormBuilder,
        private _dataContext: DataContext,
        private _userSession: UserSession) {
        const curr = new Date;
        const first = curr.getDate();
        const last = first;
        this.auditLogFilter = this._formBuilder.group({
            date: [{ begin: new Date(curr.setDate(first)), end: new Date(curr.setDate(last)) }],
            searchEmployeeName: [''],
            districtId: [0],
            organizationId: [''],
        });
    }

    ngOnInit(): void {
        this.loginedUserRole = this._userSession.getUserRoleId();
        this.loginedUserDistrictId = this._userSession.getUserDistrictId();
        if (this.loginedUserRole == 1) {
            this.GetOrganizationsByDistrictId(this.loginedUserDistrictId);
        }
        if (this.loginedUserRole == 2) {
            this.loginedUserSchoolId = this._userSession.getUserOrganizationId();
        }
        this.getAuditLog();
        this.GetDistricts();
    }

    ngAfterViewInit(): void {
    }

    getAuditLog() {
        let model = new AuditFilter();
        model.startDate = moment(this.auditLogFilter.get('date').value['begin']).format('YYYY-MM-DD');
        model.endDate = moment(this.auditLogFilter.get('date').value['end']).format('YYYY-MM-DD');
        model.searchByEmployeeName = this.auditLogFilter.get('searchEmployeeName').value;
        model.districtId = this.loginedUserRole != 5 ? this.loginedUserDistrictId : this.auditLogFilter.get('districtId').value;
        model.organizationId = this.loginedUserRole == 2 ? this.loginedUserSchoolId : model.districtId == 0 ? this.auditLogFilter.get('organizationId').setValue('0') : this.auditLogFilter.get('organizationId').value;
        this.auditLogService.getAuditView(model).subscribe((data: any) => {
            this.auditLog = data;
        });
    }

    GetDistricts(): void {
        this._dataContext.get('district/getDistricts').subscribe((data: any) => {
            this.Districts = data;
        },
            error => <any>error);
    }

    GetOrganizationsByDistrictId(districtid: any) {
        this.DistrictId = districtid;
        this._dataContext.getById('School/getOrganizationsByDistrictId', this.DistrictId).subscribe((data) => {
            this.Organizations = data;
        });
    }
}
