import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Inject, HostListener } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { UserService } from '../../Service/user.service';
import { UserSession } from '../../Services/userSession.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { SideNavService } from './sideNav.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuditFilter } from '../../Model/auditLog';
import { AuditLogService } from '../../Services/audit_logs/audit-log.service';
import { DataContext } from '../../Services/dataContext.service';
import { IEmployee } from '../../Model/Manage/employee';
import { EmployeeService } from '../../Service/Manage/employees.service';
import { environment } from 'src/environments/environment';

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
    UserRole: number = this._userSession.getUserRoleId();
    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
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

    constructor(
        private _sideNavService: SideNavService,
        private sanitizer: DomSanitizer,
        private _userSession: UserSession,
        private _userService: UserService,
        private router: Router,
        public dialog: MatDialog,
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
            width: '750px',
            panelClass: 'search-popup',
            position: { top: '65px', left: this.screenWidth - 928 + 'px' as string }
        });
        this.getScreenSize();
    }

    showSettingsPopup() {
        this.dialogRefSetting = this.dialog.open(PopupDialogForSettings, {
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
    dataSourceForUsers = new MatTableDataSource();
    dataSourceForReport = new MatTableDataSource();
    dataSource = new MatTableDataSource();
    isLoadingResults = true;
    DataSourceEmployeesObj: DataSourceEmployees | null;
    isRateLimitReached = false;
    resultsLength = 0;
    employeeName: string = '';
    showSearchDiv: boolean = false;
    resultNotFindDiv: boolean = false;
    showSearchReportDiv: boolean = false;
    private dialogRefSearch: any;
    msg: string;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns = ['firstName', 'LastName', 'Email', 'Type'];
    displayedColumnsForReports = ['employee', 'jobNumber', 'date', 'link'];

    constructor(
        private router: Router,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public sanitizer: DomSanitizer,
        private _userSession: UserSession,
        private _employeeService: EmployeeService) {
    }

    ngOnInit(): void {
        // this.GetSustitutes();
    }

    GetSustitutes(): void {
        let OrgId = -1;
        let DistrictId = this._userSession.getUserDistrictId();
        this._employeeService.getSearchContent('user/searchContent', OrgId, DistrictId).subscribe((data: any) => {
            this.dataSource.data = data;
        },
            error => this.msg = <any>error);
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    Search(searchQuery: string) {
        this.showSearchDiv = false;
        this.resultNotFindDiv = false;
        this.showSearchReportDiv = false;
        let OrgId = this._userSession.getUserOrganizationId();
        let DistrictId = this._userSession.getUserDistrictId();
        this._employeeService.getSearchContentByFilter('user/searchContent', OrgId, DistrictId, searchQuery).subscribe((data: any) => {
            this.dataSourceForUsers.data = data.filter(t => t.searchType === 1);
            this.dataSourceForReport.data = data.filter(t => t.searchType === 2);
            if (this.dataSourceForUsers.data.length > 0 && this.dataSourceForReport.data.length > 0) {
                this.showSearchDiv = true;
                this.resultNotFindDiv = false;
                this.showSearchReportDiv = true;
            }
            else if (this.dataSourceForUsers.data.length > 0 || this.dataSourceForReport.data.length < 0) {
                this.showSearchDiv = true;
                this.resultNotFindDiv = false;
                this.showSearchReportDiv = false;
            }
            else if (this.dataSourceForUsers.data.length < 0 || this.dataSourceForReport.data.length > 0) {
                this.showSearchDiv = false;
                this.resultNotFindDiv = false;
                this.showSearchReportDiv = true;
            }
            else {
                this.resultNotFindDiv = true;
            }
        },
            error => this.msg = <any>error);
    }

    openDailyReportPage() {
        this.dialog.closeAll();
        this.router.navigate(['/reports']);
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
    profilePicName: any;
    
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private sanitizer: DomSanitizer,
        private router: Router,
        private _userSession: UserSession,
        private auditLogService: AuditLogService) {
        this.profilePicName = null;
        this.UserClaim = JSON.parse(localStorage.getItem('userClaims'));
        this.UserName = this.UserClaim.firstName;
        this.profilePicName = this.UserClaim.profilePicture;
    }

    getImage(imageName: string) {
        if (imageName && imageName.length > 0) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(environment.profileImageUrl + imageName);
        }
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

    openTrainingGuide() {
        this.dialog.closeAll();
        this.router.navigate(['/trainingGuide']);
    }

    openSharedCalendar() {
        this.dialog.closeAll();
        this.router.navigate(['/shared-calendar']);
    }
}

