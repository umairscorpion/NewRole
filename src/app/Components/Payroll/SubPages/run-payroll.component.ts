import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MAT_DIALOG_DATA, MatTabGroup } from '@angular/material';
import { IDistrict } from '../../../Model/Manage/district';
import { DistrictService } from '../../../Service/Manage/district.service';
import { EmployeeService } from '../../../Service/Manage/employees.service';
import { DataContext } from '../../../Services/dataContext.service';
import { UserSession } from '../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../../Service/user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Absence } from '../../../Model/absence';

@Component({
    selector: 'run-payroll',
    templateUrl: 'run-payroll.component.html',
    styleUrls: ['run-payroll.component.scss']
})

export class RunPayroll implements OnInit {
    report: Absence[] = Array<Absence>();
    SubstituteDetail: any;
    private notifier: NotifierService;
    District: IDistrict;
    positions: any;
    payRollFilter: FormGroup;
    runPayRollDataSource = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    userTemplate: any;
    Employees: any
    msg: string;
    curr: Date = new Date;
    displayedColumns: string[] = ['Date', 'Employee', 'Location', 'Reason', 'Time', 'Hours', 'Notes', 'Substitute', 'Rate', 'Additional', 'Gross', 'action'];
    selection = new SelectionModel<any>(true, []);
    constructor(private router: Router, private _districtService: DistrictService, public dialog: MatDialog,
        private _employeeService: EmployeeService, notifier: NotifierService, private _dataContext: DataContext,
        public sanitizer: DomSanitizer, private _userSession: UserSession, private fb: FormBuilder, private userService: UserService) {
        this.notifier = notifier;
        const first = this.curr.getDate() - (this.curr.getDay() - 1);
        const last = first + 4;
        this.intializeFilter(first, last);
    }

    ngOnInit(): void {
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.runPayRollDataSource.data.length;
        return numSelected === numRows;
    }

    intializeFilter(startDateNumber: number, endDateNumber: number) {
        this.payRollFilter = this.fb.group({
            dateRange: [{ begin: new Date(this.curr.setDate(startDateNumber)), end: new Date(this.curr.setDate(endDateNumber))}],
            searchBy: ['']
        });
    }

    submitForm(form: FormGroup) {
        console.log(form);
    }

    onExportingToCSV() {
        new ngxCsv(this.report, 'My Report');
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.runPayRollDataSource.data.forEach(row => this.selection.select(row));
    }

    ngAfterViewInit() {

    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }
}


