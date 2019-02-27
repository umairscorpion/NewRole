import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    templateUrl: 'timeTracker.component.html'
})
export class TimeTrackerComponent implements OnInit {
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;

    constructor() { }
    ngOnInit(): void {
    }
}