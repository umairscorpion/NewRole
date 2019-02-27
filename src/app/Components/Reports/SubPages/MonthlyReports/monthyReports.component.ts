import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    templateUrl: 'monthlyReports.component.html'
})
export class MonthlyReportsComponent implements OnInit {
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;

    constructor() { }
    ngOnInit(): void {
    }
}