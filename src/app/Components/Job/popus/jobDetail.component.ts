import { Component, Inject } from '@angular/core';
import { DataContext } from '../../../Services/dataContext.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { JobComponent } from '../job.component';
import { SafeUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
    templateUrl: 'jobDetail.html',
    styleUrls: ['jobDetail.component.scss']
})
export class PopupDialogForJobDetail {
    msg: string;
    attachFileUrl: SafeUrl = "";
    
    constructor(
        private dialogRef: MatDialogRef<JobComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dataContext: DataContext,
        private sanitizer: DomSanitizer) {
        if (data.isShowAttachment) {
            this.viewAttachmet();
        }
    }

    viewAttachmet() {
        const model = { AttachedFileName: this.data.attachedFileName, FileContentType: this.data.fileContentType };
        this._dataContext.getFile('Absence/getfile', model).subscribe((blob: any) => {
            const newBlob = new Blob([blob]);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }
            const file = new Blob([blob], { type: blob.type });
            const Url = URL.createObjectURL(file);
            this.attachFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(Url);
        },
            error => this.msg = <any>error);
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
            // const file = new Blob([blob], { type: this.data.fileContentType });
            // window.open(URL.createObjectURL(file));

            // To Download
            let data = window.URL.createObjectURL(newBlob);
            let link = document.createElement('a');
            link.href = data;
            link.download = this.data.attachedFileName;
            link.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(data);
            }, 100);
        },
            error => this.msg = <any>error);
    }

    onClose() {
        this.dialogRef.close();
    }

    getImage(imageName: string) {
        if (imageName && imageName.length > 0) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(environment.profileImageUrl + imageName);         
        }
    }
}