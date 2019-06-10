import { Component, OnInit } from '@angular/core';
import { DataContext } from '../../../Services/dataContext.service';
import { UserSession } from '../../../Services/userSession.service';
import { MatTableDataSource } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../Model/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from '../../../Service/Manage/employees.service';
import { Organization } from '../../../Model/organization';

@Component({
    templateUrl: 'my-settings.component.html',
    styleUrls: ['my-settings.component.scss']
})
export class MySettingComponent implements OnInit {
    substituteList: User[] = Array<User>();
    UserClaim: any = JSON.parse(localStorage.getItem('userClaims'));
    TimeCustomDelay: string;
    isSubstitute: boolean = false;
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;
    Categories: any;
    NotificationEvents: any;
    PreferredSchools: any;
    OrganizationId: any;
    organizations: Organization[] = Array<Organization>();
    accessibilityOfOrganizationDropdown: boolean = false;
    ChangedPreferences: any[] = [];
    private notifier: NotifierService;
    PreferencesFormGroup: FormGroup;
    FavoriteSubstututes: Array<any> = [];
    BlockedSubstitutes: Array<any> = [];
    UserRole: number = this._userSession.getUserRoleId();
    displayedColumns: string[] = ['event', 'email', 'text'];
    notificationEvents = new MatTableDataSource();
    SubstituteList: any;
    personalFormGroup: FormGroup;
    schoolSettings: FormGroup;
    SubstituteId: any;

    constructor(
        private _dataContext: DataContext,
        notifier: NotifierService,
        private _userSession: UserSession,
        private _formBuilder: FormBuilder,
        private _employeeService: EmployeeService) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.ManageDefultValuesAgainstDifferentUserRoles();
        if (this._userSession.getUserRoleId() != 4) {
            this.GetBlockedSubstitutes();
            this.GetFavoritSubstitutes();
        }
        this.generateForms();
        this.GetSubstituteCategories();
        this.GetSubstituteNotificationEvents();
        this.GetOrganizations(this._userSession.getUserDistrictId());
    }

    ManageDefultValuesAgainstDifferentUserRoles() {
        //Show substitute Categories only to substitutes
        if (this.UserClaim.roleId === 4) {
            this.isSubstitute = true;
            this.getPreferredSchools();
        }
    }

    GetSubstituteCategories(): void {
        this._dataContext.get('user/getSubstituteCategories').subscribe((data: any) => {
            this.Categories = data;
        },
            error => <any>error);
    }

    GetSubstituteNotificationEvents(): void {
        this._dataContext.get('user/getSubstituteNotificationEvents').subscribe((data: any) => {
            this.NotificationEvents = data;
            this.notificationEvents.data = data;
        },
            error => <any>error);
    }

    getPreferredSchools(): void {
        let UserId = this._userSession.getUserId();
        this._dataContext.get('user/GetSubstitutePreferredSchools/' + UserId).subscribe((data: any) => {
            this.PreferredSchools = data;
        },
            error => <any>error);
    }

    SaveSubstitutePreference(): void {
        let model = {
            UserId: this._userSession.getUserId(),
            BlockedSubstituteList: JSON.stringify(this.BlockedSubstitutes),
            FavoriteSubstituteList: JSON.stringify(this.FavoriteSubstututes)
        }
        this._dataContext.post('user/updateSubstitutePreferrence', model).subscribe((data: any) => {
            this.notifier.notify('success', 'Updated Successfully.');
        },
            (err: HttpErrorResponse) => {
                this.notifier.notify('error', err.error.error_description);
            });
    }

    SaveCategories(Categories: any): void {
        for (let category of Categories.options._results) {
            let model = {
                OrganizationId: category.value,
                IsEnabled: category.selected
            }

            this._dataContext.Patch('user/updateUserCategories', model).subscribe((data: any) => {
            },
                (err: HttpErrorResponse) => {
                    this.notifier.notify('error', err.error.error_description);
                });
        }
        this.notifier.notify('success', 'Updated Successfully');

    }

    UpdateNotificationEvents(Event: any): void {
        let data = this.notificationEvents.data;

        this._dataContext.Patch('user/updateNotificationEvents', data).subscribe((data: any) => {

            this.notifier.notify('success', 'Updated Successfully');
            this.GetSubstituteNotificationEvents();
        },
            (err: HttpErrorResponse) => {
                this.notifier.notify('error', err.error.error_description);
            });

    }

    onChangeEmail(event) {
        event.emailAlert = !event.emailAlert;

    }

    onChangeText(event) {
        event.textAlert = !event.textAlert;
    }

    SavePreferredSchoolSettings(AllSchools: any): void {
        for (let School of AllSchools.options._results) {
            let model = {
                OrganizationId: School.value,
                IsEnabled: School.selected,
                UserId: this._userSession.getUserId()
            }
            this._dataContext.Patch('user/UpdateEnabledSchools', model).subscribe((data: any) => {
            },
                (err: HttpErrorResponse) => {
                    this.notifier.notify('error', err.error.error_description);
                });
        }
        this.notifier.notify('success', 'Updated Successfully');
    }

    getSchoolSettings() {
        this._dataContext.getById('School/getSchoolById', this.OrganizationId).subscribe((org: Organization) => {
            this.schoolSettings.patchValue({ ...org[0] });
        },
            error => <any>error);
    }

    SearchSubstitutes(SearchText: string) {
        let IsSearchSubstitute = 1;
        let OrgId = this._userSession.getUserOrganizationId();
        let DistrictId = this._userSession.getUserDistrictId();
        this.SubstituteList = this._employeeService.searchUser('user/getEmployeeSuggestions', SearchText, IsSearchSubstitute, OrgId, DistrictId);
    }

    SelectToAddInPreferredSubstitute(Substitute: any) {
        this.SubstituteList = null;
        if (this.FavoriteSubstututes.find((obj: any) => obj.userId == Substitute.userId)) {
            this.notifier.notify('error', 'Already added in this category.');
            return;
        }
        if (this.BlockedSubstitutes.find((obj: any) => obj.userId == Substitute.userId)) {
            this.notifier.notify('error', 'Already added in blocled list.');
            return;
        }
        if (this.FavoriteSubstututes.length < 5) {
            this.FavoriteSubstututes.push(Substitute);
        }
        else
            this.notifier.notify('error', 'Already added five substitutes.');
    }

    GetOrganizations(DistrictId: number): void {
        this._dataContext.getById('School/getOrganizationsByDistrictId', DistrictId).subscribe((data: any) => {
            this.organizations = data;
            if (this._userSession.getUserRoleId() === 2) {
                this.OrganizationId = this._userSession.getUserOrganizationId()
                this.getSchoolSettings();
                this.accessibilityOfOrganizationDropdown = true;
            }
        },
            error => <any>error);
    }

    GetFavoritSubstitutes() {
        let UserId = this._userSession.getUserId();
        this._dataContext.get('user/getFavoriteSubstitutes' + '/' + UserId).subscribe((data: any) => {
            this.FavoriteSubstututes = data;
        },
            error => this.msg = <any>error);
    }

    GetBlockedSubstitutes() {
        let UserId = this._userSession.getUserId();
        this._dataContext.get('user/getBlockedSubstitutes' + '/' + UserId).subscribe((data: any) => {
            this.BlockedSubstitutes = data;
        },
            error => this.msg = <any>error);
    }

    generateForms(): void {
        this.PreferencesFormGroup = this._formBuilder.group({
            BlockedSubstitutes: [''],
            PreferredSubstitites: ['']
        });
        this.schoolSettings = this._formBuilder.group({
            schoolName: [''],
            schoolId: [''],
            schoolDistrictId: [''],
            districtName: [''],
            schoolCity: [''],
            schoolAddress: [''],
            schoolEmail: [''],
            schoolPhone: [''],
            schoolTimeZone: [''],
            schoolZipCode: [''],
            schoolStartTime: [''],
            school1stHalfEnd: [''],
            school2ndHalfStart: [''],
            schoolEndTime: [''],
            releaseJobTime: [''],
            notifyOthersTime: [''],
            dailyAbenceLimit: [''],
            isAbsenceLimit: ['']
        });
    }

    SelectToBlockSubstitite(Substitute: any) {
        this.SubstituteList = null;
        if (this.BlockedSubstitutes.find((obj: any) => obj.userId == Substitute.userId)) {
            this.notifier.notify('error', 'Already added in list.');
            return;
        }
        if (this.FavoriteSubstututes.find((obj: any) => obj.userId == Substitute.userId)) {
            this.notifier.notify('error', 'Already added in favorite list.');
            return;
        }
        if (this.BlockedSubstitutes.length < 5)
            this.BlockedSubstitutes.push(Substitute);
        else
            this.notifier.notify('error', 'Already added five substitutes.');
    }

    removePreferredSub(index: number) {
        this.FavoriteSubstututes.splice(index, 1);
    }

    submitGeneralSettings(org: FormGroup) {
        this._dataContext.Patch('school/updateSchool', org.value).subscribe((data: any) => {
            this.notifier.notify('success', 'Updated Successfully.');
        },
            (err: HttpErrorResponse) => {
                this.notifier.notify('error', err.message);
            });
    }

    onchangeOrganization() {
        this.getSchoolSettings();
    }

    onChangeTab(tab: any) {
    }
}