import { Component, OnInit, ViewChild ,ChangeDetectorRef, HostBinding, Inject } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { DataContext } from '../../Services/dataContext.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CommunicationService } from '../../Services/communication.service';

@Component({
    templateUrl: 'job.component.html',
    styleUrls: ['job.component.css']
})
export class JobComponent implements OnInit {
    sideNavMenu: any;
    msg :string;
    @HostBinding('class.is-open')
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    constructor(private router: Router, private _userService: UserService, changeDetectorRef: ChangeDetectorRef, 
        media: MediaMatcher, public matDialog: MatDialog, private _communicationService: CommunicationService) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
     }
    ngOnInit(): void {
        this._communicationService.AbsenceDetail.subscribe((AbsenceDetail: any) => {
            this.JobDetail(AbsenceDetail);
        });
        this.LoadSideNavMenu();
    }
    LoadSideNavMenu(): void {
        let resourceTypeId = 3;
        let parentResourceTypeId = 8;
        this._userService.getUserResources(resourceTypeId,parentResourceTypeId,0).subscribe((data: any) => {
            this.sideNavMenu = data;
        },
            error => this.msg = <any>error);
    }

    JobDetail(data: any) {
        this.matDialog.closeAll();
        this.matDialog.open(PopupDialogForJobDetail, {
            data,
            height: '500px',
            width: '750px',
            panelClass: 'AbsenceDetail-popup',
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}

@Component({
    templateUrl: 'jobDetail.html',
    styleUrls: ['job.component.css']
})
export class PopupDialogForJobDetail {
    msg: string;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _dataContext: DataContext) {
    }

    DownloadFile(): void {
        let model = { AttachedFileName: this.data.attachedFileName, FileContentType: this.data.fileContentType }
        this._dataContext.getFile('Absence/getfile', model).subscribe((blob: any) => {
            let newBlob = new Blob([blob]);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }
            // To open in browser
            var file = new Blob([blob], { type: this.data.fileContentType });
            window.open(URL.createObjectURL(file));
            //To Download
            // let data = window.URL.createObjectURL(newBlob);
            // let link = document.createElement('a');
            // link.href = data;
            // link.download = this.data.attachedFileName;
            // link.click();
            // setTimeout(() => {
            //     window.URL.revokeObjectURL(data);
            // }, 100);
        },
            error => this.msg = <any>error);
    }
}