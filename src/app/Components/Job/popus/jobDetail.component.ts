import { Component, OnInit, ViewChild, ChangeDetectorRef, HostBinding, Inject } from '@angular/core';
import { UserService } from '../../../Service/user.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { DataContext } from '../../../Services/dataContext.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { CommunicationService } from '../../../Services/communication.service';
import { JobComponent } from '../job.component';

@Component({
    templateUrl: 'jobDetail.html',
    styleUrls: ['jobDetail.component.scss']
})
export class PopupDialogForJobDetail {
    msg: string;
    constructor(private dialogRef: MatDialogRef<JobComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any, private _dataContext: DataContext) {
    }

    DownloadFile(): void {
        const model = { AttachedFileName: this.data.attachedFileName, FileContentType: this.data.fileContentType };
        this._dataContext.getFile('Absence/getfile', model).subscribe((blob: any) => {
            const newBlob = new Blob([blob]);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }
            // To open in browser
            const file = new Blob([blob], { type: this.data.fileContentType });
            window.open(URL.createObjectURL(file));
            // To Download
            // let data = window.URL.createObjectURL(newBlob);
            // let link = document.createElement('a');
            // link.href = data;
            // link.download = this.data.attachedFileName;
            // link.click();
            // setTimeout(() => {
            // window.URL.revokeObjectURL(data);
            // }, 100);
        },
            error => this.msg = <any>error);
    }
    onClose() {
        this.dialogRef.close();
    }
}