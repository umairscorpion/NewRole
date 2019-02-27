import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    templateUrl: 'abortedAbsence.component.html'
})
export class AbortedAbsenceComponent implements OnInit {
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;

    constructor() { }
    ngOnInit(): void {
    }
}