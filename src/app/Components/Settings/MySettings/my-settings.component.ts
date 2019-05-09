import { Component, OnInit, ViewChild } from '@angular/core';
import { DataContext } from '../../../Services/dataContext.service';
import { UserSession } from '../../../Services/userSession.service';
import { MatTableDataSource } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../Model/user';
import { SocialUser } from 'angular-6-social-login';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { EmployeeService } from '../../../Service/Manage/employees.service';
@Component({
    templateUrl: 'my-settings.component.html',
    styleUrls: ['my-settings.component.scss']
})
export class MySettingComponent implements OnInit {
    displayedColumns: string[] = ['event', 'email', 'text', 'voice'];
    substituteList: User[] = Array<User>();
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
    PreferencesFormGroup: FormGroup;
    FavoriteSubstututes: Array<any> = [];
    BlockedSubstitutes: Array<any> = [];
    UserRole: number = this._userSession.getUserRoleId();
    SubstituteList: any;
    personalFormGroup: FormGroup;

    constructor(private _dataContext: DataContext, notifier: NotifierService, private _userSession: UserSession,
        private _formBuilder: FormBuilder, private _employeeService: EmployeeService) {
        this.notifier = notifier;
    }
    ngOnInit(): void {
        this.ManageDefultValuesAgainstDifferentUserRoles();
        if (this._userSession.getUserRoleId() != 4) {
            this.GetBlockedSubstitutes();
            this.GetFavoritSubstitutes();
        }
        this.generateForms();
    }

    ManageDefultValuesAgainstDifferentUserRoles() {
        //Show substitute Categories only to substitutes
        if (this.UserClaim.roleId === 4) {
            this.isSubstitute = true;
        }
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
}