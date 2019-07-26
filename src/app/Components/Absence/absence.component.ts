import { Component, ChangeDetectorRef, HostBinding, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataContext } from '../../Services/dataContext.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { SideNavService } from '../SideNav/sideNav.service';
import { CommunicationService } from '../../Services/communication.service';
import { UserSession } from '../../Services/userSession.service';
import { UpcommingAbsenceComponent } from './SubPages/UpcommingAbsence/upcommingAbsence.component';
import { CreateAbsenceComponent } from './SubPages/CreateAbsence/createAbsence.component';

@Component({
    templateUrl: 'absence.component.html',
    styleUrls: ['absence.component.scss']
})
export class absenceComponent {
    @ViewChild(UpcommingAbsenceComponent) private getUpcomingAbsences: UpcommingAbsenceComponent;
    @ViewChild(CreateAbsenceComponent) private createAbsenceComponent: CreateAbsenceComponent;
    @Output() refreshEmployeeBalance: EventEmitter<any> = new EventEmitter();
    selectedTab: number = 0;
    employeeLeaveBalance: any;
    sideNavMenu: any;
    msg: string;
    userRole: number = this._userSession.getUserRoleId();
    @HostBinding('class.is-open')
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    isOpen = true;

    constructor(
        public dialog: MatDialog,
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
        this._communicationService.refreshTabSelection.subscribe((AbsenceDetail: any) => {
            this.selectedTab = 0;
        });
    }

    onTabChange(tabIndex: any) {
        if (tabIndex.index == 1) {
            this.selectedTab = 1;
            this.getUpcomingAbsences.GetAbsences();
        }
         else if (tabIndex.index == 0) {
            this.selectedTab = 0;
            this.createAbsenceComponent.GetCreatedAbsencesOfEmployee(this._userSession.getUserId());
        }
        else {
            this.selectedTab = 2;
        }
    }

    getEmployeeBalance() {
        this.refreshEmployeeBalance.emit('emit');
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
            width: '650px',
            panelClass: 'AbsenceDetail-popup',
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}

@Component({
    templateUrl: 'absenceDetail.html',
    styleUrls: ['absence.component.scss']
})
export class PopupDialogForAbsenceDetail {
    msg: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dataContext: DataContext,
        private dialogRef: MatDialogRef<absenceComponent>) {
        if (data.originalFileName) {
            data.originalFileName = data.originalFileName.substr(0, 15);
        }
    }

    DownloadFile(): void {
        let model = { AttachedFileName: this.data.attachedFileName, FileContentType: this.data.fileContentType }
        this._dataContext.getFile('Absence/getfile', model).subscribe((blob: any) => {
            let newBlob = new Blob([blob]);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }
            //To open in browser
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

    onClose() {
        this.dialogRef.close();
    }
}