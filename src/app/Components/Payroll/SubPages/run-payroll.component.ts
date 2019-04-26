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
import { ReportService } from '../../../Services/report.service';
import { ReportDetail } from '../../../Model/Report/report.detail';
import { ReportFilter } from '../../../Model/Report/report.filter';

@Component({
    selector: 'run-payroll',
    templateUrl: 'run-payroll.component.html',
    styleUrls: ['run-payroll.component.scss']
})

export class RunPayroll implements OnInit {
    allAbsencesInCurrentState: ReportDetail[] = Array<ReportDetail>();
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
        private reportService: ReportService, notifier: NotifierService, private _dataContext: DataContext,
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
            dateRange: [{ begin: new Date(this.curr.setDate(startDateNumber)), end: new Date(this.curr.setDate(endDateNumber)) }],
            searchBy: ['1'],
            searchByName: ['']
        });
        this.submitForm(this.payRollFilter);
    }

    submitForm(form: FormGroup) {
        const filters = ReportFilter.initial();
        filters.fromDate = form.value.dateRange.begin;
        filters.toDate = form.value.dateRange.end;
        this.reportService.getPayrollDetails(filters).subscribe((details: ReportDetail[]) => {
            details = details.filter(t => t.statusId === 2 || t.statusId === 3);
            if (+form.value.searchBy === 1) {
                if (form.value.searchByName) {
                    details = details.filter((reportdetail: ReportDetail) => reportdetail.employeeName.toLowerCase().includes(form.value.searchByName.toLowerCase()));
                }
            }

            else if (+form.value.searchBy === 2) {
                if (form.value.searchByName) {
                    details = details.filter((reportdetail: ReportDetail) => reportdetail.schoolName.toLowerCase().includes(form.value.searchByName.toLowerCase()));
                }
            }

            else {
                if (form.value.searchByName) {
                    details = details.filter((reportdetail: ReportDetail) => reportdetail.substituteName.toLowerCase().includes(form.value.searchByName.toLowerCase()));
                }
            }
            this.runPayRollDataSource.data = details;
            this.allAbsencesInCurrentState = details;
        });
    }

    onExportingToCSV() {
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
        let absencesForPrint = this.allAbsencesInCurrentState.filter(function (absence: any) {
            delete absence.substituteId;
            delete absence.absencePosition;
            delete absence.employeeTypeTitle;
            delete absence.grade;
            delete absence.subject;
            delete absence.postedById;
            delete absence.postedByName;
            delete absence.statusId;
            delete absence.substituteName;
            delete absence.anyAttachment;
            delete absence.fileContentType;
            delete absence.substituteRequired;
            delete absence.durationType;
            delete absence.attachedFileName;
            delete absence.statusDate;
            delete absence.substituteProfilePicUrl;
            delete absence.absenceId;
            delete absence.startTime;
            delete absence.endTime;
            return true;
        });
        new ngxCsv(JSON.stringify(absencesForPrint), new Date().toLocaleDateString(), configuration);
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


