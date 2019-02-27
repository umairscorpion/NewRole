import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    templateUrl: 'dailyReports.component.html'
})
export class DailyReportsComponent implements OnInit {
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;

    constructor() { }
    ngOnInit(): void {
    }
}