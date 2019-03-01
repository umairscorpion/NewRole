import { Component, OnInit, ViewChild } from '@angular/core';
import { DataContext } from '../../Services/dataContext.service';
import { UserSession } from '../../Services/userSession.service';
import { MatTableDataSource } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.css']
})
export class SettingComponent implements OnInit {
    displayedColumns: string[] = ['event', 'email', 'text', 'voice'];
    dataSource = ELEMENT_DATA;
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

    constructor(private _dataContext: DataContext, notifier: NotifierService, private _userSession : UserSession) { this.notifier = notifier; }
    ngOnInit(): void {
        this.GetSubstituteCategories();
        this.ManageDefultValuesAgainstDifferentUserRoles();
    }

    ManageDefultValuesAgainstDifferentUserRoles() {
        //Show substitute Categories only to substitutes
        if (this.UserClaim.roleId === 4) {
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
        if (tab.index == 3) {
            this.getPreferredSchools();
        }
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
                Id: category.value,
                IsNotificationSend: category.selected
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

    SavePreferredSchoolSettings(Schools: any): void {
        for (let School of Schools.options._results) {
            let model = {
                Id: School.value,
                IsNotificationSend: School.selected
            }
            this._dataContext.Patch('user/UpdateEnabledSchools', model).subscribe((data: any) => {
            },
                (err: HttpErrorResponse) => {
                    this.notifier.notify('error', err.error.error_description);
                });
        }
        this.notifier.notify('success', 'Updated Successfully');
    }
}
export interface PeriodicElement {
    Event: string;
    Email: boolean;
    Text: boolean;
    voice: boolean;
}
const ELEMENT_DATA: PeriodicElement[] = [
    { Event: 'Job Approved', Email: true, Text: true, voice: true },
    { Event: 'Job Denied', Email: false, Text: true, voice: true },
    { Event: 'Job Posted', Email: true, Text: true, voice: false },
];