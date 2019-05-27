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
        for (let i= 0; i < 5; i++ ) {
            this.years.push(new Years(new Date().getFullYear() + i));
        }
        this.getLeaveEmployeeLeaveBalance();
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
        this.dataContext.get('Leave/getEmployeeLeaveBalance/' + this.year + '/' + "-1").subscribe((response: LeaveBalance[]) => {
            this.employeeLeaveBalance.data = response;
        })
    }

    applyFilter() {
        this.dataContext.get('Leave/getEmployeeLeaveBalance/' + this.year + '/' + this.employee.userId).subscribe((response: LeaveBalance[]) => {
            this.employeeLeaveBalance.data = response;
        })
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