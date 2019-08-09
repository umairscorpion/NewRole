import { Component, Inject } from '@angular/core';
import { DataContext } from '../../../Services/dataContext.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { JobComponent } from '../job.component';
import { SafeUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { NotifierService } from 'angular-notifier';

@Component({
    templateUrl: 'runningLate.component.html',
    styleUrls: ['runningLate.component.scss']
})
export class PopupDialogForRunningLate {
    RunningLate: any;
    private notifier: NotifierService;

    constructor(
        private dialogRef: MatDialogRef<JobComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        notifier: NotifierService,
        private _dataContext: DataContext,
        private sanitizer: DomSanitizer) {
            this.notifier = notifier;
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

    SendMessage(RunningMessage: any){
        this._dataContext.get('Job/sendRunningLateMessage/' + RunningMessage + "/" + this.data).subscribe((response: any) => {
            if(response == 'Sent'){
                this.notifier.notify('success', 'Message Sent Successfully.');
                this.onClose();
            }
            else{
                this.notifier.notify('error', 'Message Not Sent.');
            }
        },
            error => <any>error);
    }

}