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

@Component({
    selector: 'daily-reports',
    templateUrl: 'dailyReports.component.html'
})
export class DailyReportsComponent implements OnInit, AfterViewInit {
    @ViewChildren('chartTotal') chartTotal: ElementRef;
    @ViewChild('chartFilled') chartFilled: ElementRef;
    @ViewChild('chartUnFilled') chartUnFilled: ElementRef;
    @ViewChild('chartNoSubReq') chartNoSubReq: ElementRef;
    context: CanvasRenderingContext2D;

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

    constructor(
        private reportService: ReportService,
        private dialogRef: MatDialog,
        private sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.loadReportSummary();
    }

    loadReportSummary() {
        const filters = ReportFilter.initial();
        this.date = moment(filters.fromDate).format('dddd, MM/DD/YYYY');
        this.reportService.getSummary(filters).subscribe((summary: ReportSummary[]) => {
            this.resetChart();
            this.bindChart(summary[0]);
        });
        this.reportService.getDetail(filters).subscribe((details: ReportDetail[]) => {
            this.bindDetails(details);
        });
    }

    onSubmit($event) {
        this.date = moment($event.formValue.fromDate).format('dddd, MM/DD/YYYY');
        this.reportService.getSummary($event.formValue).subscribe((summary: ReportSummary[]) => {
            this.resetChart();
            this.bindChart(summary[0]);
        });
        this.reportService.getDetail($event.formValue).subscribe((details: ReportDetail[]) => {
            this.bindDetails(details);
        });
    }

    bindDetails(details: ReportDetail[]) {
        this.filledAbsenceDetails = details.filter(t => t.statusId === 2 || t.statusId === 3);
        this.unFilledAbsenceDetails = details.filter(t => t.statusId === 1 && t.substituteRequired === true);
        this.noSubReqAbsenceDetails = details.filter(t => t.substituteRequired === false);
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
        const dialogEdit = this.dialogRef.open(
            ReportDetailsComponent,
            {                
                panelClass: 'report-details-dialog',
                data: absenceDetail                                                   
            }
        );

        dialogEdit.afterClosed().subscribe(result => {
            if(result == 'Reload')
            { 
                this.loadReportSummary();                          
            }
        });
    }

    getImage(profileImageUrl: string) {
        if (profileImageUrl && profileImageUrl.length > 0) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrl + '/wwwroot/Profile/' + profileImageUrl);
        }
    }
}
