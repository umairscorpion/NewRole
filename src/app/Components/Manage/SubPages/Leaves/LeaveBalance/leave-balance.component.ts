import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DistrictService } from '../../../../../Service/Manage/district.service';
import { UserSession } from '../../../../../Services/userSession.service';
import { NotifierService } from '../../../../../../../node_modules/angular-notifier';
import { DataContext } from '../../../../../Services/dataContext.service';
import { LeaveBalance } from '../../../../../Model/leaveBalance';

@Component({
    selector: 'leave-balance',
    templateUrl: 'leave-balance.component.html',
    styleUrls: ['leave-balance.component.scss']
})
export class LeaveBalanceComponent implements OnInit {
    years: Years[] = Array<Years>();
    employeeLeaveBalance = new MatTableDataSource();
    displayedColumnsForLeaveRequests = ['Year', 'Name', 'Personal', 'Sick', 'Vacation'];
    private notifier: NotifierService;
    position: FormGroup;
    msg: string;
    constructor(private fb: FormBuilder, notifier: NotifierService, private dataContext: DataContext,
        private userSession: UserSession) {
        this.notifier = notifier;
    }

    ngOnInit() {
        for (let i= 0; i < 5; i++ ) {
            this.years.push(new Years(new Date().getFullYear() + i));
        }
        this.getLeaveEmployeeLeaveBalance();
    }

    getLeaveEmployeeLeaveBalance() {
        this.dataContext.get('Leave/getEmployeeLeaveBalance').subscribe((response: LeaveBalance[]) => {
            this.employeeLeaveBalance.data = response;
        })
    }
}

export class Years {
    value: number
    constructor(year: number) {
        this.value = year;
    }
}