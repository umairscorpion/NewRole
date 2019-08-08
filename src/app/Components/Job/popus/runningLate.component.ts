import { Component, Inject } from '@angular/core';
import { DataContext } from '../../../Services/dataContext.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { JobComponent } from '../job.component';
import { SafeUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
    templateUrl: 'runningLate.component.html',
    styleUrls: ['runningLate.component.scss']
})
export class PopupDialogForRunningLate {
    RunningLate: any;
    
    constructor(
        private dialogRef: MatDialogRef<JobComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dataContext: DataContext,
        private sanitizer: DomSanitizer) {
    }

    ngOnInit(): void {
        this.GetRunningLate();
    }

    onClose() {
        this.dialogRef.close();
    }

    GetRunningLate(){
        this._dataContext.get('Job/getRunningLate').subscribe((data: any) => {
            this.RunningLate = data;
        },
            error => <any>error);
    }

}