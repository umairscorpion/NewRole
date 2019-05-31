import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../../Service/Manage/employees.service';
import { HttpErrorResponse, HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataContext } from '../../../../Services/dataContext.service';
import { UserSession } from '../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { FileService } from '../../../../Services/file.service';
import { ShowAttachmentPopupComponent } from '../../../../Shared/show-attachment-popup/show-attachment-popup.component';
import { MatDialog } from '@angular/material';
import { UserService } from '../../../../Service/user.service';
@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']

})
export class ProfileComponent implements OnInit {
    LoginedUserId: any = 0;
    private notifier: NotifierService;
    ProfilePicture: any;
    msg: string;
    UserClaim: any;
    personalFormGroup: FormGroup;
    officialFormGroup: FormGroup;
    PreferencesFormGroup: FormGroup;
    resetPasswordForm: FormGroup;
    profilePictureUrl: string;
    SubstituteList: any;
    FavoriteSubstututes: Array<any> = [];
    BlockedSubstitutes: Array<any> = [];
    UserRole: number = this._userSession.getUserRoleId();
    AllAttachedFiles: any;
    FileName: string;
    OriginalFileName: string;
    FileContentType: string;
    FileExtention: string;
    CompletedPercentage: number;
    SuccessMessage: boolean;
    SubstituteFiles: any;
    public resetPassAttempt: boolean;
    OriginalFileNameForDisplay: any;

    constructor(
        private sanitizer: DomSanitizer,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        notifier: NotifierService,
        private _datacontext: DataContext,
        private _userSession: UserSession,
        private _employeeService: EmployeeService,
        private http: HttpClient,
        private _fileService: FileService,
        private dialogRef: MatDialog, ) {
        this.notifier = notifier
    }

    ngOnInit(): void {
        if (this._userSession.getUserRoleId() != 4) {
            this.GetBlockedSubstitutes();
            this.GetFavoritSubstitutes();
        }
        this.generateForms();
        this.getSubstututeFiles();
    }

    onSubmitPersonalForm(form: any) {
        if (this.personalFormGroup.valid) {
            let model = {
                UserId: this.LoginedUserId,
                Email: form.value.Email
            }
            this.userService.post('user/verify', model).subscribe((result: any) => {
                if (result) {
                    this.notifier.notify('error', 'This email address belongs to another user. Please try with other one.');
                }
                else {
                    let personalFormModel = {
                        UserId: this.LoginedUserId,
                        FirstName: form.value.FirstName,
                        LastName: form.value.LastName,
                        Email: form.value.Email,
                        PhoneNumber: form.value.PhoneNumber,
                        ProfilePicture: this.profilePictureUrl
                    }
                    this._datacontext.Patch('user/updateUserProfile', personalFormModel).subscribe((data: any) => {
                        this.notifier.notify('success', 'Updated Successfully');
                        let personalFormModel = {
                            FirstName: data.firstName,
                            LastName: data.lastName,
                            Email: data.email,
                            PhoneNumber: data.phoneNumber
                        }
                
                        this.LoginedUserId = this.UserClaim.id;
                        this.getProfileImage(data.profilePicture);
                        this.personalFormGroup.setValue(personalFormModel);
                    },
                        (err: HttpErrorResponse) => {
                            // this.toastr.error(err.error.error_description, 'Oops!');
                        });
                }
            });
        }
    }

    generateForms(): void {

        this.resetPasswordForm = this._formBuilder.group({
            currentPassword: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)]],
            confirmPassword: ['', Validators.required]
        });
        this.resetPasswordForm.validator = this.passwordMatchValidator;

        this.personalFormGroup = this._formBuilder.group({
            FirstName: new FormControl({ value: '' }, Validators.required),
            LastName: ['', Validators.required],
            Email: ['', [Validators.required, Validators.email]],
            PhoneNumber: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
        });

        this.officialFormGroup = this._formBuilder.group({
            EmployeeID: new FormControl({ value: '', disabled: true }, Validators.required),
            EmployeeType: new FormControl({ value: '', disabled: true }, Validators.required),
            Certified: new FormControl({ value: '', disabled: true }, Validators.required),
            Organization: new FormControl({ value: '', disabled: true }, Validators.required),
        });

        this.PreferencesFormGroup = this._formBuilder.group({
            BlockedSubstitutes: [''],
            PreferredSubstitites: ['']
        });

        this.UserClaim = JSON.parse(localStorage.getItem('userClaims'));
        let personalFormModel = {
            FirstName: this.UserClaim.firstName,
            LastName: this.UserClaim.lastName,
            Email: this.UserClaim.email,
            PhoneNumber: this.UserClaim.phoneNumber
        }

        this.LoginedUserId = this.UserClaim.id;
        this.getProfileImage(this.UserClaim.profilePicture);
        this.personalFormGroup.setValue(personalFormModel);
    }

    passwordMatchValidator(frm: FormGroup) {
        return frm.controls['password'].value ===
            frm.controls['confirmPassword'].value
            ? null
            : { mismatch: true };
    }

    onFromSubmit(form: any) {

    }

    submitResetPassForm(form: FormGroup) {
        if (form.valid) {
            this.userService.get('user/checkUserPassword/' + this._userSession.getUserEmailId() + "/" + form.value.currentPassword).
                subscribe((result: any) => {
                    if (result) {
                        var model = {
                            userId: this._userSession.getUserId(),
                            password: form.value.confirmPassword
                        }
                        this.userService.post('user/updatePassword', model).subscribe(result => {
                            this.notifier.notify('success', 'Password successfully changed');
                        },
                            error => this.msg = <any>error);
                    }
                    else {
                        this.notifier.notify('error', 'Current password not correct.');
                    }

                },
                    error => this.msg = <any>error);
        }
        this.resetPassAttempt = true;
    }

    GetSustitutes(): void {
        let roleId = 4;
        let orgId = this._userSession.getUserOrganizationId();
        let DistrictId = this._userSession.getUserDistrictId();
        this._datacontext.get('user/getUsers' + '/' + roleId + '/' + orgId + '/' + DistrictId).subscribe((data: any) => {
            this.SubstituteList = data;
        },
            error => this.msg = <any>error);
    }

    //Starting Functions Related To Preference Tab
    GetFavoritSubstitutes() {
        let UserId = this._userSession.getUserId();
        this._datacontext.get('user/getFavoriteSubstitutes' + '/' + UserId).subscribe((data: any) => {
            this.FavoriteSubstututes = data;
        },
            error => this.msg = <any>error);
    }

    GetBlockedSubstitutes() {
        let UserId = this._userSession.getUserId();
        this._datacontext.get('user/getBlockedSubstitutes' + '/' + UserId).subscribe((data: any) => {
            this.BlockedSubstitutes = data;
        },
            error => this.msg = <any>error);
    }

    //ASYNC FUNCTION TO SEARCH Substitutes
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

    SaveSubstitutePreference(): void {
        let model = {
            UserId: this._userSession.getUserId(),
            BlockedSubstituteList: JSON.stringify(this.BlockedSubstitutes),
            FavoriteSubstituteList: JSON.stringify(this.FavoriteSubstututes)
        }
        this._datacontext.post('user/updateSubstitutePreferrence', model).subscribe((data: any) => {
            this.notifier.notify('success', 'Updated Successfully.');
        },
            (err: HttpErrorResponse) => {
                this.notifier.notify('error', err.error.error_description);
            });
    }
    //Ended Funtions Related To Preference Tab

    onSelectFile(event: any) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event: any) => {
                this.ProfilePicture = event.target.result;
            }
        }
    }

    //UPLOAD ATTACHEMNT
    uploadClick() {
        const fileUpload = document.getElementById('UploadButton') as HTMLInputElement;
        fileUpload.click();
    }

    upload(files: File[]) {
        this.uploadAndProgress(files);
    }

    removeAttachedFile() {
        this.AllAttachedFiles = null;
        this.OriginalFileName = null;
        this.OriginalFileNameForDisplay = null;
    }

    uploadAndProgress(files: File[]) {
        this.AllAttachedFiles = files;
        this.FileContentType = files[0].type;
        if (!this.FileContentType) this.FileContentType = "text/plain";
        this.OriginalFileName = this.AllAttachedFiles[0].name;
        this.OriginalFileNameForDisplay = this.OriginalFileName.substr(0, 15);
        this.FileExtention = files[0].name.split('.')[1];
        let formData = new FormData();
        Array.from(files).forEach(file => formData.append('file', file))
        this.http.post(environment.apiUrl + 'fileSystem/uploadFile', formData).subscribe(event => {
            this.SuccessMessage = true;
            this.FileName = event.toString();
        });
    }

    getSubstututeFiles(): void {
        let model = {
            fileType: "Substitute Files"
        }
        this._fileService.getFile(model).subscribe((respose: any) => {
            this.SubstituteFiles = respose;
        });
    }

    AddFile() {
        if (this.OriginalFileName == null) {
            this.notifier.notify('error', 'Please upload file');
            return;
        }
        let model = {
            originalFileName: this.OriginalFileName,
            fileName: this.FileName,
            fileContentType: this.FileContentType,
            fileExtention: this.FileExtention,
            fileType: 1
        }
        this._fileService.addFile('fileSystem/addFiles', model).subscribe((respose: any) => {
            this.SubstituteFiles = respose;
        });
    }

    DeleteFile(file: any) {
        let model = {
            fileName: file.fileName,
            fileContentType: file.fileContentType,
            fileExtention: file.fileExtention,
            fileType: "Substitute Files"
        }
        this._fileService.deleteFile('fileSystem/deleteFiles', model).subscribe((respose: any) => {
            this.SubstituteFiles = respose;
        });
    }

    ViewFile(fileData: any) {
        this.dialogRef.open(
            ShowAttachmentPopupComponent, {
                panelClass: 'app-show-attachment-popup',
                data: fileData
            }
        );
    }

    DownloadFile(file: any): void {
        const model = { FileName: file.fileName, FileContentType: file.fileContentType };
        this._datacontext.getFile('fileSystem/getUploadFile', model).subscribe((blob: any) => {
            const newBlob = new Blob([blob]);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }
            // To open in browser
            // const files = new Blob([blob], { type: file.attachedFileId });
            // window.open(URL.createObjectURL(files));   
            // To Download
            let data = window.URL.createObjectURL(newBlob);
            let link = document.createElement('a');
            link.href = data;
            link.download = file.fileName;
            link.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(data);
            }, 100);
        });
    }

    getProfileImage(ImageName: string) {
        let model = {
            AttachedFileName: ImageName,
            FileContentType: ImageName.split('.')[1],
        }
        this._fileService.getProfilePic(model).subscribe((blob: Blob) => {
            let newBlob = new Blob([blob]);
            var file = new Blob([blob], { type: blob.type });
            let Url = URL.createObjectURL(file);
            this.ProfilePicture = this.sanitizer.bypassSecurityTrustUrl(Url);
            this.profilePictureUrl = ImageName;
        },
            error => this.msg = <any>error);
    }

    // On Selecting Profile Image
    onSelectProfileImage(event: any) {
        if (event.target.files && event.target.files[0]) {
            let formData = new FormData();
            formData.append('UserId', this.LoginedUserId);
            var mimeType = event.target.files[0].type;
            if (mimeType.match(/image\/*/) == null) {
                this.notifier.notify('error', 'Only images are supported.');
                return;
            }
            Array.from(event.target.files).forEach((file: File) => formData.append('file', file))
            this._fileService.uploadProfilePicture(formData)
                .subscribe(responseEvent => {
                    if (responseEvent.type === HttpEventType.UploadProgress) {

                    } else if (responseEvent instanceof HttpResponse) {
                        this.profilePictureUrl = responseEvent.body.toString();
                        var reader = new FileReader();
                        reader.readAsDataURL(event.target.files[0]);
                        reader.onload = (event: any) => {
                            this.ProfilePicture = event.target.result;
                        }
                    }
                });
        }
    }
}