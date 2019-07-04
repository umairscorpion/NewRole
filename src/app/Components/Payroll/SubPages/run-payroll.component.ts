import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { IDistrict } from '../../../Model/Manage/district';
import { NotifierService } from 'angular-notifier';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ngxCsv } from 'ngx-csv';
import { Absence } from '../../../Model/absence';
import { ReportService } from '../../../Services/report.service';
import { ReportDetail } from '../../../Model/Report/report.detail';
import { ReportFilter } from '../../../Model/Report/report.filter';
import { EditPayrollComponent } from '../Popups/edit-payroll.popup.component';
import { DatePipe } from '../../../../../node_modules/@angular/common';
import { Workbook } from 'exceljs';
import { ExcelService } from '../../../Services/excel.service';
import { Excell } from '../../../Services/excell';

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
    selection = new SelectionModel<ReportDetail>(true, []);

    constructor(
        public dialog: MatDialog,
        private reportService: ReportService,
        notifier: NotifierService,
        public sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private excelService: ExcelService,
        private datePipe: DatePipe,
        private eess:Excell) {
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
        const title = 'Payroll Report';
            const header = ["Employee Name", "Absence Id", "Reason", "Date", "Time", "District", "Status", "Substitute", "Notes", "Pay Rate", "Hours", "School"]
            let workbook = new Workbook();
            let worksheet = workbook.addWorksheet('Report');
            let titleRow = worksheet.addRow([title]);
            // Set font, size and style in title row.
            titleRow.font = { name: 'Comic Sans MS', family: 4, size: 13, underline: 'none', bold: false };
            // Blank Row
            worksheet.addRow([]);
            //Add row with current date
            let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')]);
            worksheet.mergeCells('A1:D2');
            //Add Header Row
            let headerRow = worksheet.addRow(header);
            // Cell Style : Fill and Border
            headerRow.eachCell((cell, number) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'A1A1A3' },
                    bgColor: { argb: 'A1A1A3' }
                }
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            });
            this.allAbsencesInCurrentState.forEach(obj => {
                let result = this.objToArray(obj);
                worksheet.addRow(result);
            });
            this.eess.generateExcel();
            workbook.xlsx.writeBuffer().then((data) => {
                this.excelService.saveAsExcelFile(data, 'PayRollReport');
            });

    }

    onExportingToCSVV() {
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
            this.runPayRollDataSource.data.forEach((row: ReportDetail) => this.selection.select(row));
    }

    ngAfterViewInit() {
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    onEditPayrollReport() {
        if (this.selection.selected.length > 0) {
            const dialogRef = this.dialog.open(EditPayrollComponent, {
                data: this.selection.selected,
                panelClass: 'edit-payroll-dialog'
            });
            dialogRef.afterClosed().subscribe(result => {
                this.submitForm(this.payRollFilter);
            });
        }
        else {
            this.notifier.notify('error', 'select absence first then click edit.');
        }
    }
    objToArray(report: ReportDetail) {
        var result = [];
        result.push(report.employeeName, report.absenceId, report.reason, report.startDate + " - " + report.endDate,
            report.startTime + "-" + report.endTime,
            report.districtName, report.statusTitle, report.substituteName, report.notes,
            report.payRate, report.dailyHours, report.schoolName)
        return result;
    }
}


