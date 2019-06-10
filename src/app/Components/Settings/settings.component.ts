import { Component, OnInit } from '@angular/core';
import { DataContext } from '../../Services/dataContext.service';
import { UserSession } from '../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../Model/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Organization } from '../../Model/organization';
import { AbsenceScope } from '../../Model/absenceScope';

@Component({
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.css']
})
export class SettingComponent implements OnInit {
    displayedColumns: string[] = ['event', 'email', 'text', 'voice'];
    substituteList: User[] = Array<User>();
    OrganizationId: any;
    accessibilityOfOrganizationDropdown: boolean = false;
    organizations: Organization[] = Array<Organization>();
    UserClaim: any = JSON.parse(localStorage.getItem('userClaims'));
    TimeCustomDelay: string;
    isSubstitute: boolean = false;
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;
    Categories: any;
    PreferredSchools: any;
    ChangedPreferences: any[] = [];
    private notifier: NotifierService;
    schoolSettings: FormGroup;
    FavoriteSubstututes: Array<any> = [];
    BlockedSubstitutes: Array<any> = [];
    UserRole: number = this._userSession.getUserRoleId();
    SubstituteList: any;
    personalFormGroup: FormGroup;
    absenceTypes: AbsenceScope[] = Array<AbsenceScope>();

    constructor(
        private _dataContext: DataContext,
        notifier: NotifierService,
        private _userSession: UserSession,
        private _formBuilder: FormBuilder) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        for (let i = 0; i <= 4; i++) {
            this.substituteList.push(new User());
        }
        this.GetSubstituteCategories();
        this.ManageDefultValuesAgainstDifferentUserRoles();
        this.generateForms();
        this.GetOrganizations(this._userSession.getUserDistrictId());
    }

    generateForms(): void {
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

    ManageDefultValuesAgainstDifferentUserRoles() {
        //Show substitute Categories only to substitutes
        if (this.UserClaim.roleId === 4) {
            this.getPreferredSchools();
            this.isSubstitute = true;
        }
    }

    GetSubstituteCategories(): void {
        this._dataContext.get('user/getSubstituteCategories').subscribe((data: any) => {
            this.Categories = data;
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

    onChangeTab(tab: any) {

    }

    ChangeNotificationPreference(row: any, type: string): void {
        this.ChangedPreferences.slice(1, 1);
        if (type == 'Email')
            row.Email = !row.Email
        if (type == 'Text')
            row.Text = !row.Text
        if (type == 'voice')
            row.voice = !row.voice
        this.ChangedPreferences.push(row)
    }

    SaveNotificationSettings(): void {
        if (this.ChangedPreferences.length > 0) {
            let JsonString: string = JSON.stringify(this.ChangedPreferences);
        }
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

    SaveCustomSettings() {
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

    saveSubstituteList(substituteList: any): void {
        console.log(this.substituteList);
    }

    getSchoolSettings() {
        this._dataContext.getById('School/getSchoolById', this.OrganizationId).subscribe((org: Organization) => {
            this.schoolSettings.patchValue({ ...org[0] });
        },
            error => <any>error);
    }

    getAbsenceTypes(orgId: string) {
        const model = {
            schoolId: orgId ? orgId : "-1",
            SchoolDistrictId: this._userSession.getUserDistrictId()
        }
        this._dataContext.post('School/getAbsenceScopes', model).subscribe((scopes: AbsenceScope[]) => {
            this.absenceTypes = scopes;
        },
            error => <any>error);
    }

    GetOrganizations(DistrictId: number): void {
        this._dataContext.getById('School/getOrganizationsByDistrictId', DistrictId).subscribe((data: any) => {
            this.organizations = data;
            if (this._userSession.getUserRoleId() === 2) {
                this.OrganizationId = this._userSession.getUserOrganizationId();
                this.getAbsenceTypes(this.OrganizationId);
                this.getSchoolSettings();
                this.accessibilityOfOrganizationDropdown = true;
            }
        },
            error => <any>error);
    }

    submitGeneralSettings(org: FormGroup, absenceTypes: AbsenceScope[]) {
        absenceTypes.forEach(type => {
            type.organizatonId = org.value.schoolId
            type.districtId = this._userSession.getUserDistrictId();
        });
        this._dataContext.post('school/updateAbsenceScopes', absenceTypes).subscribe((data: any) => {
            this.getAbsenceTypes(this.OrganizationId);
        },
            (err: HttpErrorResponse) => {
                this.notifier.notify('error', err.message);
            });
        this._dataContext.Patch('school/updateSchool', org.value).subscribe((data: any) => {
            this.notifier.notify('success', 'Updated Successfully.');
        },
            (err: HttpErrorResponse) => {
                this.notifier.notify('error', err.message);
            });
    }

    onchangeOrganization() {
        this.getAbsenceTypes(this.OrganizationId);
        this.getSchoolSettings();
    }

    absenceVisibilityChanged(absecetype, $event) {
        absecetype.visibility = !absecetype.visibility;
    }
}