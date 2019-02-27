import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
    templateUrl: 'permissions.component.html'
})
export class PermissionsComponent implements OnInit {
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;

    constructor() { }
    ngOnInit(): void {
    }
}