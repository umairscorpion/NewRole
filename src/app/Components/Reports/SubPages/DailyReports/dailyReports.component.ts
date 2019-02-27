import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    templateUrl: 'dailyReports.component.html'
})
export class DailyReportsComponent implements OnInit {
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;
    date = new Date();

    doughnutChartLabels: string[] = ['Filled', 'UnFilled', 'No Sub Required'];
    doughnutChartData: number[] = [4, 1, 5];
    doughnutChartType = 'doughnut';
    doughnutChartOptions: any = {
        responsive: true,
        cutoutPercentage: 80,
        legend: {
            position: 'bottom'
        },
        elements: {
            center: {
                text: 'Desktop',
                color: '#36A2EB', //Default black
                fontStyle: 'Helvetica', //Default Arial
                sidePadding: 15 //Default 20 (as a percentage)
            }
        }
    };

    constructor() { }
    ngOnInit(): void {
    }
}