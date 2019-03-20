import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    templateUrl: 'viewEmployee.html',
    styleUrls: ['employee-detail.popup.component.css']
  })
  export class PopupDialogForEmployeeDetail {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data);
    }
  }