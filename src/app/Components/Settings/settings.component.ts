import { Component, OnInit, ViewChild } from '@angular/core';
import { DataContext } from '../../Services/dataContext.service';
import { UserSession } from '../../Services/userSession.service';
import { MatTableDataSource } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../Model/user';
import { SocialUser } from '../../../../node_modules/angular-6-social-login';
@Component({
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.css']
})
export class SettingComponent implements OnInit {
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

    constructor(private _dataContext: DataContext, notifier: NotifierService, private _userSession: UserSession) { 
        this.notifier = notifier; 
    }
    ngOnInit(): void {
        for (let i = 0; i <= 4; i++) {
            this.substituteList.push(new User());
        }
        this.GetSubstituteCategories();
        this.ManageDefultValuesAgainstDifferentUserRoles();
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
}