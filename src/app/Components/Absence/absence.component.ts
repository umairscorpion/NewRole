import { Component, ChangeDetectorRef, HostBinding, Inject } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { DataContext } from '../../Services/dataContext.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SideNavService } from '../SideNav/sideNav.service';
import { CommunicationService } from '../../Services/communication.service';
import { UserSession } from '../../Services/userSession.service';
import { LeaveBalance } from '../../Model/leaveBalance';

@Component({
    templateUrl: 'absence.component.html',
    styleUrls: ['absence.component.css']
})
export class absenceComponent {
    employeeLeaveBalance: any;
    sideNavMenu: any;
    msg: string;
    userRole: number = this._userSession.getUserRoleId();
    @HostBinding('class.is-open')
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    isOpen = true;
    constructor(
        private _userService: UserService, 
        public dialog: MatDialog, 
        private dataContext: DataContext,
        private sideNavService: SideNavService, 
        private _userSession: UserSession,
        private _communicationService: CommunicationService,
        changeDetectorRef: ChangeDetectorRef, 
        media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.LoadSideNavMenu();
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });
        this._communicationService.AbsenceDetail.subscribe((AbsenceDetail: any) => {
            this.AbsenceDetail(AbsenceDetail);
        });
        if(this._userSession.getUserRoleId() === 3) this.getEmployeeBalance();
    }

    getEmployeeBalance() {
        this.dataContext.get('Leave/getEmployeeLeaveBalance/' + new Date().getFullYear() + '/' + this._userSession.getUserId()).subscribe((response: LeaveBalance[]) => {
            this.employeeLeaveBalance = response;
        })
    }

    LoadSideNavMenu(): void {
        const config = {
            resourceTypeId: 3,
            parentResourceTypeId: 2,
            isAdminPanel: 0
        }
        this._communicationService.UpdatePanel(config);
    }

    AbsenceDetail(data: any) {
        this.dialog.closeAll();
        this.dialog.open(PopupDialogForAbsenceDetail, {
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
    templateUrl: 'absenceDetail.html',
    styleUrls: ['absence.component.css']
})
export class PopupDialogForAbsenceDetail {
    msg: string;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, 
        private _dataContext: DataContext) {
        console.log(data);
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