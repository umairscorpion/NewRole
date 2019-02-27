import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    templateUrl: 'schoolSubList.component.html'
})
export class SchoolSubListComponent implements OnInit {
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;

    constructor() { }
    ngOnInit(): void {
    }
}