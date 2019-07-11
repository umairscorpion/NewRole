import { Component, OnInit, ViewChild, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { ReportService } from '../../../../Services/report.service';
import { ReportFilter } from '../../../../Model/Report/report.filter';
import { ReportSummary } from '../../../../Model/Report/report.summary';
import { ReportConstant } from '../../constants/report.constants';
import * as moment from 'moment';
import { ReportDetail } from '../../../../Model/Report/report.detail';
import { MatDialog } from '@angular/material';
import { ReportDetailsComponent } from '../../popups/report-details.popup.component';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { ExcelService } from '../../../../Services/excel.service';
import { AuditFilter } from '../../../../Model/auditLog';
import { AuditLogService } from '../../../../Services/audit_logs/audit-log.service';
import { DatePipe } from '../../../../../../node_modules/@angular/common';
import { Workbook } from 'exceljs';

@Component({
    selector:'monthly-reports',
    templateUrl: 'monthlyReports.component.html'
})
export class MonthlyReportsComponent implements OnInit, AfterViewInit {
    @ViewChildren('chartTotal') chartTotal: ElementRef;
    @ViewChild('chartFilled') chartFilled: ElementRef;
    @ViewChild('chartUnFilled') chartUnFilled: ElementRef;
    @ViewChild('chartNoSubReq') chartNoSubReq: ElementRef;
    context: CanvasRenderingContext2D;
    selectedTabIndex: any = 0;
    currentDate: Date = new Date();
    msg: string;
    indLoading = false;
    modalTitle: string;
    modalBtnTitle: string;
    date: string = moment().format('dddd, MM/DD/YYYY');
    noAbsenceMessage = true;
    submitted = false;
    reportSummary: ReportSummary = new ReportSummary();
    totalAbsence: Array<number> = [];
    filledAbsence: Array<number> = [];
    unFilledAbsence: Array<number> = [];
    noSubReqAbsence: Array<number> = [];
    absenceSummary = [];
    totalChartOptions = {};
    totalChartColors = ReportConstant.DailyReport.Chart.Colors.Total;
    filledChartColors = ReportConstant.DailyReport.Chart.Colors.Filled;
    unFilledChartColors = ReportConstant.DailyReport.Chart.Colors.unFilled;
    noSubReqChartColors = ReportConstant.DailyReport.Chart.Colors.NoSubReq;
    chartOptions = ReportConstant.DailyReport.Chart.Options;
    absenceSummaryColors = ReportConstant.DailyReport.Chart.Colors.AbsenceSummary;
    filledAbsenceDetails: ReportDetail[] = Array<ReportDetail>();
    unFilledAbsenceDetails: ReportDetail[] = Array<ReportDetail>();
    noSubReqAbsenceDetails: ReportDetail[] = Array<ReportDetail>();
    allAbsencesInCurrentState: ReportDetail[] = Array<ReportDetail>();
    insertAbsencesLogView: any;

    constructor(
        private reportService: ReportService,
        private dialogRef: MatDialog,
        private sanitizer: DomSanitizer,
        private excelService: ExcelService,
        private auditLogService: AuditLogService,
        private datePipe: DatePipe
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.loadReportSummary();
        this.selectedTabIndex = 1;
    }

    loadReportSummary() {
        const filters = ReportFilter.initial();
        const date = new Date();
        filters.fromDate = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD');
        filters.toDate = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('YYYY-MM-DD');
        this.reportService.getSummary(filters).subscribe((summary: ReportSummary[]) => {
            this.resetChart();
            this.bindChart(summary[0]);
        });
        this.reportService.getDetail(filters).subscribe((details: ReportDetail[]) => {
            this.bindDetails(details);
            this.allAbsencesInCurrentState = details;
        });
    }

    onSubmit($event) {
        this.date = moment($event.formValue.fromDate).format('dddd, MM/DD/YYYY');
        this.reportService.getSummary($event.formValue).subscribe((summary: ReportSummary[]) => {
            this.resetChart();
            this.bindChart(summary[0]);
        });
        this.reportService.getDetail($event.formValue).subscribe((details: ReportDetail[]) => {
            this.allAbsencesInCurrentState = details;
            this.bindDetails(details);
        });
        if ($event.actionName == "print") {
            const title = 'Report';
            const header = ["Employee Name", "Absence Id", "Reason", "Date", "Time", "District", "Status", "Substitute", "Notes", "School"]
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
            workbook.xlsx.writeBuffer().then((data) => {
                this.excelService.saveAsExcelFile(data, 'Report.xlsx');
            });
        }      
    }

    onSubmitt($event) {
        this.date = moment($event.formValue.fromDate).format('dddd, MM/DD/YYYY');
        this.reportService.getSummary($event.formValue).subscribe((summary: ReportSummary[]) => {
            this.resetChart();
            this.bindChart(summary[0]);
        });
        this.reportService.getDetail($event.formValue).subscribe((details: ReportDetail[]) => {
            this.allAbsencesInCurrentState = details;
            this.bindDetails(details);
        });
        if ($event.actionName == "print") {
            this.allAbsencesInCurrentState = this.allAbsencesInCurrentState.filter(function (absence) {
                delete absence.substituteId;
                delete absence.absencePosition;
                delete absence.employeeTypeTitle;
                delete absence.grade;
                delete absence.subject;
                delete absence.postedById;
                delete absence.statusId;
                delete absence.anyAttachment;
                delete absence.fileContentType;
                delete absence.substituteRequired;
                delete absence.durationType;
                delete absence.statusDate;
                delete absence.substituteProfilePicUrl;
                return true;
            });
            this.excelService.exportAsExcelFile(this.allAbsencesInCurrentState, 'Report');
            this.loadReportSummary();
        }      
    }

    bindDetails(details: ReportDetail[]) {
        this.filledAbsenceDetails = details.filter(t => (t.statusId === 2 || t.statusId === 3) && t.substituteRequired === true && t.isApproved === true);
        this.unFilledAbsenceDetails = details.filter(t => t.statusId === 1 && t.substituteRequired === true && t.isApproved === true);
        this.noSubReqAbsenceDetails = details.filter(t => t.substituteRequired === false && t.statusId === 1 && t.isApproved === true);
    }

    bindChart(chartSummary: ReportSummary) {
        if (chartSummary.totalCount <= 0) {
            this.noAbsenceMessage = true;
        } else {
            this.reportSummary = chartSummary;
            this.noAbsenceMessage = false;
            this.totalAbsence.push(chartSummary.totalCount);
            this.filledAbsence.push(chartSummary.totalCount);
            this.filledAbsence.push(chartSummary.filled);
            this.unFilledAbsence.push(chartSummary.totalCount);
            this.unFilledAbsence.push(chartSummary.unfilled);
            this.noSubReqAbsence.push(chartSummary.totalCount);
            this.noSubReqAbsence.push(chartSummary.noSubRequired);
            this.absenceSummary.push(chartSummary.filled);
            this.absenceSummary.push(chartSummary.unfilled);
            this.absenceSummary.push(chartSummary.noSubRequired);
        }
    }

    resetChart() {
        this.totalAbsence = [];
        this.filledAbsence = [];
        this.unFilledAbsence = [];
        this.noSubReqAbsence = [];
        this.absenceSummary = [];
    }

    reportDetails(absenceDetail: ReportDetail) {
        const model = new AuditFilter();
        model.entityId = absenceDetail.confirmationNumber;
        this.auditLogService.insertAbsencesLogView(model).subscribe((result: any) => {
            this.insertAbsencesLogView = result;
        });
        
        const dialogEdit = this.dialogRef.open(
            ReportDetailsComponent,
            {
                panelClass: 'report-details-dialog',
                data: absenceDetail
            }
        );
        dialogEdit.afterClosed().subscribe(result => {
            if (result == 'Reload') {
                this.loadReportSummary();
            }
        });
    }

    getImage(imageName: string) {
        if (imageName && imageName.length > 0) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(environment.profileImageUrl + imageName);         
        }
    }
    
    objToArray(report: ReportDetail) {
        var result = [];
        result.push(report.employeeName, report.absenceId, report.reason, report.startDate + " - " + report.endDate,
            report.startTime + "-" + report.endTime,
            report.districtName, report.statusTitle, report.substituteName, report.notes, report.schoolName)
        return result;
    }
}
