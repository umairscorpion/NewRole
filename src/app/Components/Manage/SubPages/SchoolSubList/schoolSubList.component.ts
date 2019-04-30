import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    selector: 'school-sub-list',
    templateUrl: 'schoolSubList.component.html',
    styleUrls: ['schoolSubList.component.scss']
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