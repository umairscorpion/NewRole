import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DistrictService } from '../../../../../Service/Manage/district.service';
import { UserSession } from '../../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { DataContext } from '../../../../../Services/dataContext.service';
import { LeaveBalance } from '../../../../../Model/leaveBalance';
import { EmployeeService } from '../../../../../Service/Manage/employees.service';
import { Observable } from 'rxjs';
import { IEmployee } from '../../../../../Model/Manage/employee';
import { User } from '../../../../../Model/user';
import { ngxCsv } from '../../../../../../../node_modules/ngx-csv';

@Component({
    selector: 'leave-balance',
    templateUrl: 'leave-balance.component.html',
    styleUrls: ['leave-balance.component.scss']
})
export class LeaveBalanceComponent implements OnInit {
    year: number = new Date().getFullYear();
    employee: User;
    years: Years[] = Array<Years>();
    employees: Observable<IEmployee[]>;
    employeeLeaveBalance = new MatTableDataSource();
    displayedColumnsForLeaveRequests = ['Year', 'Name', 'Personal', 'Sick', 'Vacation'];
    private notifier: NotifierService;
    position: FormGroup;
    msg: string;
    constructor(private fb: FormBuilder, notifier: NotifierService, private dataContext: DataContext,
        private userSession: UserSession, private employeeService: EmployeeService) {
        this.notifier = notifier;
    }

    ngOnInit() {
        for (let i = 0; i < 5; i++) {
            this.years.push(new Years(new Date().getFullYear() + i));
        }
        this.getLeaveEmployeeLeaveBalance();
        this.employeeLeaveBalance.filterPredicate = (data: any, filtersJson: string) => {
            const matchFilter = [];
            const filters = JSON.parse(filtersJson);

            const userName = 'userName';
            const sch = data[userName] === null ? '' : data[userName];
            matchFilter.push(sch.toLowerCase().includes(filters[0].value.toLowerCase()));
            return matchFilter.every(Boolean);
        };
    }

    //ASYNC FUNCTION TO SEARCH EMPLOYEE
    SearchEmployees(SearchedText: string) {
        let IsSearchSubstitute = 0;
        let OrgId = this.userSession.getUserOrganizationId();
        let DistrictId = this.userSession.getUserDistrictId();
        //this.Employees.map(employee => employee.filter(employees => employees.FirstName === SearchEmployees));
        this.employees = this.employeeService.searchUser('user/getEmployeeSuggestions', SearchedText, IsSearchSubstitute, OrgId, DistrictId);
        this.employees = this.employees.map((users: any) => users.filter(user => user.userId != this.userSession.getUserId()));
    }

    getLeaveEmployeeLeaveBalance() {
        let filter = {
            organizationId: this.userSession.getUserOrganizationId(),
            districtId: this.userSession.getUserDistrictId(),
            year: this.year,
            userId: "All"
        }
        this.dataContext.post('Leave/getEmployeeLeaveBalance', filter).subscribe((response: LeaveBalance[]) => {
            this.employeeLeaveBalance.data = response;
        })
    }

    applyFilter(employeeName: any) {
        const tableFilters = [];
        tableFilters.push({
            id: 'userName',
            value: employeeName.value
        });

        this.employeeLeaveBalance.filter = JSON.stringify(tableFilters);
        if (this.employeeLeaveBalance.paginator) {
            this.employeeLeaveBalance.paginator.firstPage();
        }
    }

    generateCSV() {
        var configuration = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'Payroll Report',
            useBom: false,
            noDownload: false,
            headers: ['Employee', 'Reason', 'start Date', 'End Date', 'Location', 'Accepted Date', 'Status']
        };
        new ngxCsv(JSON.stringify(this.employeeLeaveBalance.data), new Date().toLocaleDateString(), configuration);
    }

    //For Display Employee name in text box
    displayName(user?: any): string | undefined {
        return user ? user.firstName : undefined;
    }
}

export class Years {
    value: number
    constructor(year: number) {
        this.value = year;
    }
}