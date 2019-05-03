import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataContext } from 'src/app/Services/dataContext.service';
import { UserSession } from 'src/app/Services/userSession.service';
import { EmployeeService } from 'src/app/Service/Manage/employees.service';
import { Observable } from 'rxjs/Observable';
import { IEmployee } from 'src/app/Model/Manage/employee';

@Component({
    selector: 'app-audit-log',
    templateUrl: './audit-log.component.html',
    styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {

    noAbsenceMessage = true;
    auditLog: any;
    filledAbsenceDetails: any;
    searchAuditLogsForm: FormGroup;
    Employees: Observable<IEmployee[]>;
    SearchedEmployee: string;
    SearchedEmployeeId: string;

    constructor(
        private _dataContext: DataContext,
        private _formBuilder: FormBuilder,
        private _userSession: UserSession,
        private _EmployeeService: EmployeeService
    ) {
        const curr = new Date;
        const first = curr.getDate();
        const last = first;
        this.searchAuditLogsForm = this._formBuilder.group({
            date: [{ begin: new Date(curr.setDate(first)), end: new Date(curr.setDate(last)) }],
            SearchByEmployeeId: [null]
        });
    }

    ngOnInit(): void {
        this.getAuditLog();
    }

    ngAfterViewInit(): void {
    }

    getAuditLog() {
        const model = {
            'startDate': this.searchAuditLogsForm.get('date').value['begin'],
            'endDate': this.searchAuditLogsForm.get('date').value['end']
        };
        this._dataContext.post('audit/getAuditLog', model).subscribe((availabilities: any) => {
            this.auditLog = availabilities;
            this.bindDetails(availabilities);
        });
    }

    bindDetails(details: any) {
        this.filledAbsenceDetails = details;
    }

    //ASYNC FUNCTION TO SEARCH EMPLOYEE
    SearchEmployees(SearchedText: string) {
        let IsSearchSubstitute = 0;
        let OrgId = this._userSession.getUserOrganizationId();
        let DistrictId = this._userSession.getUserDistrictId();
        this.Employees = this._EmployeeService.searchUser('user/getEmployeeSuggestions', SearchedText, IsSearchSubstitute, OrgId, DistrictId);
        this.Employees = this.Employees.map((users: any) => users.filter(user => user.userId != this._userSession.getUserId()));
    }

     //CHANGE OF SELECTED EMPLOYEE FOR WHICH WE CREATE ABSENCE
     employeeSelection(EmployeeDetail: any) {
        this.SearchedEmployee= EmployeeDetail.firstName;
        this.SearchedEmployeeId = EmployeeDetail.userId;
    }

    applyFilter(form: FormGroup) {
        const model = {
            'startDate': this.searchAuditLogsForm.get('date').value['begin'].toLocaleDateString(),
            'endDate': this.searchAuditLogsForm.get('date').value['end'].toLocaleDateString(),
            'SearchByEmployeeId': this.SearchedEmployeeId
        };
        this._dataContext.post('audit/getAuditLog', model).subscribe((availabilities: any) => {
            this.auditLog = availabilities;
            this.bindDetails(availabilities);
        });
    }

}
