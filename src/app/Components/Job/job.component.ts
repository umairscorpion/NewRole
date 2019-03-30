import { Component, OnInit, ViewChild ,ChangeDetectorRef, HostBinding, Inject } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { SideNavService } from '../SideNav/sideNav.service'; 
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CommunicationService } from '../../Services/communication.service';
import { PopupDialogForJobDetail } from './popus/jobDetail.component';

@Component({
    templateUrl: 'job.component.html',
    styleUrls: ['job.component.css']
})
export class JobComponent implements OnInit {
    sideNavMenu: any;
    msg :string;
    isOpen = true;
    @HostBinding('class.is-open')
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    constructor(private router: Router, private _userService: UserService, changeDetectorRef: ChangeDetectorRef, 
        media: MediaMatcher, public matDialog: MatDialog, private _communicationService: CommunicationService, 
        private sideNavService: SideNavService) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
     }
    ngOnInit(): void {
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });


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
            height: '600px',
            width: '750px',
            panelClass: 'AbsenceDetail-popup',
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}