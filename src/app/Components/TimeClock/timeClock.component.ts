import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    templateUrl: 'timeClock.component.html'
})
export class TimeClockComponent implements OnInit {
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;

    constructor() { }
    ngOnInit(): void {
    }
}