import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
    selector: 'allowance-details',
    templateUrl: 'add-allowance.popup.component.html',
    styleUrls: ['add-allowance.popup.component.scss']
})
export class AllowanceComponent implements OnInit {
    constructor(private dialogRef: MatDialogRef<AllowanceComponent>) {

    }
    
    onCloseDialog() {
        this.dialogRef.close();
    }

    ngOnInit() {
    }

}