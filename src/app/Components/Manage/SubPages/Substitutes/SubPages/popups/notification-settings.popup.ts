import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SafeUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { DataContext } from 'src/app/Services/dataContext.service';
import { SubstitutesComponent } from '../../substitutes.component';
import { MatTableDataSource } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';

@Component({
    templateUrl: 'notification-settings.popup.html',
    styleUrls: ['notification-settings.popup.scss']
})
export class PopupDialogForNotificationSettings {
    Categories: any;
    GradeLevelNotifications: any;
    SubjectNotifications:any;
    displayedColumnsForCategories: string[] = ['category', 'notification'];
    categoriesForNotification = new MatTableDataSource();
    displayedColumnsForGradeLevels: string[] = ['grade', 'notification'];
    gradeLevelsForNotification = new MatTableDataSource();
    displayedColumnsForSubjects: string[] = ['subject', 'notification'];
    subjectsForNotification = new MatTableDataSource();
    private notifier: NotifierService;
    
    constructor(
        private dialogRef: MatDialogRef<SubstitutesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dataContext: DataContext,
        notifier: NotifierService,
        private sanitizer: DomSanitizer) {
            this.notifier = notifier;
       
    }
    ngOnInit(): void {
        this.GetSubstituteCategories();
        this.GetGradeLevelsForNotification();
        this.GetSubjectsForNotifications();
        this.data;
    }
    GetGradeLevelsForNotification(): void {
        this._dataContext.getById('user/getGradeLevelsForNotificationById', this.data).subscribe((data: any) => {
            this.GradeLevelNotifications = data;
            this.gradeLevelsForNotification.data = data;
        },
            error => <any>error);
    }

    GetSubjectsForNotifications(): void {
        this._dataContext.getById('user/getSubjectsForNotificationsById', this.data).subscribe((data: any) => {
            this.SubjectNotifications = data;
            this.subjectsForNotification.data = data;
        },
            error => <any>error);
    }
    GetSubstituteCategories(): void {
        this._dataContext.getById('user/getSubstituteCategoriesById', this.data).subscribe((data: any) => {
            this.Categories = data;
            this.categoriesForNotification.data = data;
        },
            error => <any>error);
    }
    SaveCategories(Categories: any): void {

        let data = this.categoriesForNotification.data;
        this._dataContext.Patch('user/updateUserCategories', data).subscribe((data: any) => {
            this.notifier.notify('success', 'Updated Successfully');
        },
            (err: HttpErrorResponse) => {
                this.notifier.notify('error', err.error.error_description);
            });
    }
    UpdateGradeLevelNotifications(Event: any): void {
        let data = this.gradeLevelsForNotification.data;

        this._dataContext.Patch('user/updateGradeLevelNotification', data).subscribe((data: any) => {

            this.notifier.notify('success', 'Updated Successfully');
            this.GetGradeLevelsForNotification();
        },
            (err: HttpErrorResponse) => {
                this.notifier.notify('error', err.error.error_description);
            });

    }

    UpdateSubjectNotifications(Event: any): void {
        let data = this.subjectsForNotification.data;

        this._dataContext.Patch('user/updateSubjectNotification', data).subscribe((data: any) => {

            this.notifier.notify('success', 'Updated Successfully');
            this.GetSubjectsForNotifications();
        },
            (err: HttpErrorResponse) => {
                this.notifier.notify('error', err.error.error_description);
            });

    }

    onChangeCategory(event) {
        event.isNotificationSend = !event.isNotificationSend;
    }

    onChangeGrade(event)
    {
        event.gradeNotification = !event.gradeNotification;
    }

    onChangeSubject(event)
    {
        event.subjectNotification = !event.subjectNotification;
    }
    onClose() {
        this.dialogRef.close();
    }
}