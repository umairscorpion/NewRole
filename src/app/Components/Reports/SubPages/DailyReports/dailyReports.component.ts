import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/Services/report.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportFilter } from 'src/app/Model/Report/report.filter';
import { ReportSummary } from 'src/app/Model/Report/report.summary';
@Component({
    templateUrl: 'dailyReports.component.html'
})
export class DailyReportsComponent implements OnInit {
    msg: string;
    indLoading = false;
    modalTitle: string;
    modalBtnTitle: string;
    date = new Date();
    reportFilterForm: FormGroup;
    reportSummary: ReportSummary = new ReportSummary();

    totalChartColors: Array<any> = [
        {
            backgroundColor: '#12A2FE',
            borderColor: '#696969',
        }
    ];
    filledChartColors: Array<any> = [
        {
            backgroundColor: '#6FD128',
            borderColor: '#696969',
        },
        {
            backgroundColor: '#ffffff',
            borderColor: '#696969',
        }
    ];
    unFilledChartColors: Array<any> = [
        {
            backgroundColor: '#FF0000',
            borderColor: '#696969',
        },
        {
            backgroundColor: '#ffffff',
            borderColor: '#696969',
        }
    ];
    noSubReqChartColors: Array<any> = [
        {
            backgroundColor: '#6FD128',
            borderColor: '#696969',
        },
        {
            backgroundColor: '#FF0000',
            borderColor: '#696969',
        },
        {
            backgroundColor: '#12A2FE',
            borderColor: '#696969',
        }
    ];
    chartOptions: any = {
        responsive: true,
        cutoutPercentage: 80,
        legend: {
            position: 'bottom'
        },
        elements: {
            center: {
                text: 'Desktop',
                color: '#36A2EB',
                fontStyle: 'Helvetica',
                sidePadding: 15
            }
        }
    };

    barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    barChartData: any[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];


    totalAbsence: number[] = [5];
    filledAbsence: number[] = [3, 2];
    unFilledAbsence: number[] = [1, 2];
    noSubReqAbsence: number[] = [0];
    absenceSummaryColors = [];
    absenceSummary: number[] = [5, 4, 3];
    constructor(
        private fb: FormBuilder,
        private reportService: ReportService
    ) {
        this.reportFilterForm = this.initReportFilters();
    }

    ngOnInit(): void {
        this.loadReportSummary();
    }

    initReportFilters() {
        return ReportFilter.CreateFilterFormGroup(this.fb);
    }

    loadReportSummary() {
        this.reportService.getSummary(this.reportFilterForm.value).subscribe((summary: any) => {
            this.reportSummary = summary;
        });
    }
}
