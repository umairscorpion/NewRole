﻿import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Inject, HostListener } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { UserService } from '../../Service/user.service';
import { UserSession } from '../../Services/userSession.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SideNavService } from './sideNav.service';
import { MatSidenav } from '@angular/material/sidenav';
import { FileService } from '../../Services/file.service';
import { AuditFilter } from 'src/app/Model/auditLog';
import { AuditLogService } from 'src/app/Services/audit_logs/audit-log.service';
import { merge } from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { of as observableOf } from 'rxjs/observable/of';
import { DataContext } from 'src/app/Services/dataContext.service';
import { IEmployee } from '../../Model/Manage/employee';
import { EmployeeService } from 'src/app/Service/Manage/employees.service';

@Component({
    selector: 'Subzz-app-SideNav',
    templateUrl: 'sideNav.component.html',
    styleUrls: ['sideNav.component.css']
})

export class SideNavComponent implements OnInit {
    private dialogRefSearch: any;
    private dialogRefSetting: any;
    @ViewChild('Topnav') sidenav: MatSidenav;
    UserClaim: any;
    msg: string;
    UserName: string;
    ProfilePicture: any;
    isLoggedIn$: Observable<boolean>;
    //For Storing Current Screen Size
    screenHeight: any;
    screenWidth: any;
    
    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        //   this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        if (this.dialogRefSearch && typeof this.dialogRefSearch != 'undefined')
            this.dialogRefSearch.updatePosition({ top: '65px', left: this.screenWidth - 928 + 'px' as string });
        if (this.dialogRefSetting && typeof this.dialogRefSetting != 'undefined')
            this.dialogRefSetting.updatePosition({ top: '65px', left: this.screenWidth - 890 + 'px' as string });
        if (this.screenWidth < 896) {
            if (this.dialogRefSearch && typeof this.dialogRefSearch != 'undefined')
                this.dialogRefSearch.updatePosition({ top: '65px' });
            if (this.dialogRefSetting && typeof this.dialogRefSetting != 'undefined')
                this.dialogRefSetting.updatePosition({ top: '65px' });
        }
    }
    constructor(private _sideNavService: SideNavService, private sanitizer: DomSanitizer, private _userSession: UserSession,
        private _userService: UserService, private router: Router, public dialog: MatDialog,
        public matDialogRef: MatDialogRef<any>) {
        this.getScreenSize();
    }
    ngOnInit(): void {
        this.isLoggedIn$ = this._userService.isLoggedIn;
        this.UserClaim = JSON.parse(localStorage.getItem('userClaims'));
        this.UserName = this.UserClaim.firstName;
        this.ProfilePicture = this.sanitizer.bypassSecurityTrustUrl(this.UserClaim.profilePicture ? this.UserClaim.profilePicture : 'assets/Images/noimage.png');
    }

    ShowAbsenceDetail(): void {
        alert("Called");
    }

    showSearchPopup() {
        this.dialogRefSearch = this.dialog.open(PopupDialogForSearch, {
            // height: '300px',
            width: '750px',
            panelClass: 'search-popup',
            position: { top: '65px', left: this.screenWidth - 928 + 'px' as string }
        });
        this.getScreenSize();
    }

    showSettingsPopup() {
        this.dialogRefSetting = this.dialog.open(PopupDialogForSettings, {
            // height: '300px',
            width: '750px',
            panelClass: 'setting-popup',
            position: { top: '65px', left: this.screenWidth - 890 + 'px' as string }
        });
        this.getScreenSize();
    }

    toggle() {
        this._sideNavService.toggle();
    }

    Logout() {
        this._userService.logout();
        localStorage.removeItem('userToken');
        localStorage.removeItem('userClaims');      
        this.router.navigate(['/']);
    }

    GotoDashboard() {
        if (this._userSession.getUserRoleId() == 4)
            this.router.navigate(['/viewjobs']
            );
        else if (this._userSession.getUserRoleId() == 3)
            this.router.navigate(['/absence']
            );
        else
            this.router.navigate(['/home']
            );
    }
}

@Component({
    templateUrl: 'popups/searchPopup.html',
    styleUrls: ['sideNav.component.css']
})
export class PopupDialogForSearch {
    dataSource = new MatTableDataSource();
    isLoadingResults = true;
    DataSourceEmployeesObj: DataSourceEmployees | null;
    isRateLimitReached = false;
    resultsLength = 0;
    employeeName: string = '';
    msg: string;
    @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    displayedColumns = ['firstName', 'LastName', 'Email', 'Type'];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer, private _dataContext: DataContext,
    private _userSession:UserSession,  private _employeeService:EmployeeService) {
    }
    ngOnInit(): void {
    // this.GetSustitutes();
      }
    
      GetSustitutes(): void {
        let OrgId = -1;
        let DistrictId = this._userSession.getUserDistrictId();
        this._employeeService.getSearchContent('user/searchContent',OrgId, DistrictId).subscribe((data: any) => {
          this.dataSource.data = data;
        },
          error => this.msg = <any>error);
      }
      ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    Search(searchQuery: string) {
        let OrgId = -1;
        let DistrictId = this._userSession.getUserDistrictId();
        this._employeeService.getSearchContentByFilter('user/searchContent',OrgId, DistrictId, searchQuery).subscribe((data: any) => {
          this.dataSource.data = data;
        },
          error => this.msg = <any>error);
        
      }
    
}
export class DataSourceEmployees {
    constructor(private _dataContext: DataContext, private _UserSession: UserSession) { }
    getRepoIssues(sort: string, order: string, page: number): Observable<IEmployee[]> {
  
      let RoleId = 3;
      let OrgId = this._UserSession.getUserOrganizationId();
      let DistrictId = this._UserSession.getUserDistrictId();
      return this._dataContext.get('user/getUsers' + '/' + RoleId + '/' + OrgId + '/' + DistrictId);
    }
  }
@Component({
    templateUrl: 'popups/settingPopup.html',
    styleUrls: ['sideNav.component.css']
})
export class PopupDialogForSettings {
    UserClaim: any;
    msg: string;
    UserName: string;
    ProfilePicture: any;
    userRole: number = this._userSession.getUserRoleId();
    insertAuditLogout: any;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fileService: FileService,
        public dialog: MatDialog, private sanitizer: DomSanitizer, private router: Router, private _userSession: UserSession, private auditLogService: AuditLogService) {
        this.UserClaim = JSON.parse(localStorage.getItem('userClaims'));
        this.UserName = this.UserClaim.firstName;
        let profilePicName: string = this.UserClaim.profilePicture;
        let model = {
            AttachedFileName: profilePicName,
            FileContentType: profilePicName.split('.')[1],
            UserId: _userSession.getUserId()
        }

        this.fileService.getProfilePic(model).subscribe((blob: Blob) => {
            let newBlob = new Blob([blob]);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }
            var file = new Blob([blob], { type: blob.type });
            let Url = URL.createObjectURL(file);
            this.ProfilePicture = this.sanitizer.bypassSecurityTrustUrl(Url);
        },
            error => this.msg = <any>error);

    }
    Logout() {
        const model = new AuditFilter();
        this.auditLogService.insertAuditLogout(model).subscribe((result: any) => {
            this.insertAuditLogout = result;
        });
        localStorage.removeItem('userToken');
        localStorage.removeItem('userClaims');
        this.router.navigate(['/']);
        this._userSession.nullUserSession();
    }

    OpenSettingsPage() {
        this.dialog.closeAll();
        this.router.navigate(['/settings']);
    }

    OpenProfilePage() {
        this.dialog.closeAll();
        this.router.navigate(['/profile']);
    }

    openSubstituteUnavailabilityCalendar() {
        this.dialog.closeAll();
        this.router.navigate(['/availability']);
    }

    openCalendar() {
        this.dialog.closeAll();
        this.router.navigate(['/calendar']);
    }
    openTimeClockPage() {
        this.dialog.closeAll();
        this.router.navigate(['/timeclock']);
    }

    openMySettings() {
        this.dialog.closeAll();
        this.router.navigate(['/mysettings']);
    }
    openAuditLog() {
        this.dialog.closeAll();
        this.router.navigate(['/auditLog']);
    }
    
}

