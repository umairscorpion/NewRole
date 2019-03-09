import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ReportService } from 'src/app/Services/report.service';
import { ReportFilter } from 'src/app/Model/Report/report.filter';
import { ReportSummary } from 'src/app/Model/Report/report.summary';
import { ReportConstant } from '../../constants/report.constants';
import * as moment from 'moment';
import { ReportDetail } from 'src/app/Model/Report/report.detail';
import { MatDialog } from '@angular/material';
import { ReportDetailsComponent } from '../../popups/report-details.popup.component';

@Component({
    templateUrl: 'dailyReports.component.html'
})
export class DailyReportsComponent implements OnInit, AfterViewInit {
    @ViewChild('chartTotal') chartTotal: ElementRef;
    @ViewChild('chartFilled') chartFilled: ElementRef;
    @ViewChild('chartUnFilled') chartUnFilled: ElementRef;
    @ViewChild('chartNoSubReq') chartNoSubReq: ElementRef;
    context: CanvasRenderingContext2D;

    msg: string;
    indLoading = false;
    modalTitle: string;
    modalBtnTitle: string;
    date: string = moment().format('dddd, DD/MM/YYYY');
    noAbsenceMessage = true;
    submitted = false;
    reportSummary: ReportSummary = new ReportSummary();
    totalAbsence = [];
    filledAbsence = [];
    unFilledAbsence = [];
    noSubReqAbsence = [];
    absenceSummary = [];
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
        private dialogRef: MatDialog
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.loadReportSummary();
    }

    loadReportSummary() {
        const filters = ReportFilter.initial();
        this.date = moment(filters.fromDate).format('dddd, DD/MM/YYYY');
        this.reportService.getSummary(filters).subscribe((summary: ReportSummary[]) => {
            this.resetChart();
            this.bindChart(summary[0]);
        });
        this.reportService.getDetail(filters).subscribe((details: ReportDetail[]) => {
            console.log({ detail: details });
        });
    }

    onSubmit($event) {
        this.date = moment($event.formValue.fromDate).format('dddd, DD/MM/YYYY');
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
        this.unFilledAbsenceDetails = details.filter(t => t.statusId === 1);
        this.noSubReqAbsenceDetails = details.filter(t => t.statusId === 0);
    }

    bindChart(chartSummary: ReportSummary) {
        if (chartSummary.totalCount <= 0) {
            this.noAbsenceMessage = true;
        } else {
            this.noAbsenceMessage = false;
            this.totalAbsence.push(chartSummary.totalCount);
            this.filledAbsence.push(chartSummary.totalCount);
            this.filledAbsence.push(chartSummary.filled);
            this.unFilledAbsence.push(chartSummary.filled);
            this.unFilledAbsence.push(chartSummary.unfilled);
            this.noSubReqAbsence.push(chartSummary.noSubRequired);
            this.absenceSummary.push(chartSummary.filled);
            this.absenceSummary.push(chartSummary.unfilled);
            this.absenceSummary.push(chartSummary.noSubRequired);

            if (this.chartTotal) {
                const canvas = this.chartTotal.nativeElement;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.font = '30px Arial';
                    ctx.fillText('Hello World', 10, 50);
                    ctx.save();
                }
            }
            // this.chartTotal.nativeElement.getContext('2d').fillText('Hello World', 10, 50);
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
        this.dialogRef.open(
            ReportDetailsComponent,
            {
                panelClass: 'report-details-dialog',
                data: absenceDetail
            }
        );
    }
}
