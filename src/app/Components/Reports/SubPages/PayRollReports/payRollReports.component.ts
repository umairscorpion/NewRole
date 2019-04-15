import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    selector:'payroll-reports',
    templateUrl: 'payRollReports.component.html'
})
export class PayRollReportsComponent implements OnInit {
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;

    constructor() { }
    ngOnInit(): void {
    }
}