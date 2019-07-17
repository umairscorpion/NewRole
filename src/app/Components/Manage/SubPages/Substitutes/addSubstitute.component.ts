import { Component, OnInit, ViewChild } from '@angular/core';
import { DataContext } from '../../../../Services/dataContext.service';
import { UserSession } from '../../../../Services/userSession.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router, ActivatedRoute } from '@angular/router';
import { IStates } from '../../../../Model/Lookups/states';
import { HttpErrorResponse, HttpResponse, HttpEventType } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs/Observable';
import { NotifierService } from 'angular-notifier';
import { FileService } from '../../../../Services/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersService } from 'src/app/Services/users.service';
import { environment } from 'src/environments/environment';

@Component({
    templateUrl: 'addSubstitute.component.html'
})
export class AddSubstituteComponent implements OnInit {
    profilePictureUrl: string
    userIdForUpdate: string;
    profilePicture: any;
    private notifier: NotifierService;
    userTypes: any;
    positions: any;
    TeachingLevels: any;
    Districts: any;
    states: Observable<IStates[]>;
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('modal') modal: ModalComponent;
    msg: string;
    substituteForm: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private _dataContext: DataContext,
        notifier: NotifierService,
        private route: ActivatedRoute,
        private _userSession: UserSession,
        private fileService: FileService,
        private sanitizer: DomSanitizer,
        private userService: UsersService) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.substituteForm = this.fb.group({
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            UserTypeId: ['', Validators.required],
            TeachingLevel: [''],
            Speciality: [''],
            IsCertified: ['1', Validators.required],
            IsSubscribedEmail: ['1', Validators.required],
            IsSubscribedSMS: ['1', Validators.required],
            Gender: ['M', Validators.required],
            District: ['', Validators.required],
            Email: ['', [Validators.required, Validators.email]],
            PhoneNumber: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
            PayRate: ['0'],
            HourLimit: ['0'],
<<<<<<< HEAD
            IsActive: [1],
            // Password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)]]
=======
            IsActive: [1]
>>>>>>> ac3c34bef4eda9b5dad68d853de262020d5cf1e0
        });
        this.getpositions()
        // this.GetUserTypes();
        this.GetDistricts();
        this.GetTeachingLevels();
        this.route.queryParams.subscribe((params: any) => {
            if (params['Id']) {
                const SubstituteId = params.Id;
                this._dataContext.getById('user/getUserById', SubstituteId).subscribe((data: any) => {
                    // To make validation of Speaciality and Teacher level when editing
                    this.onChangeEmployeeType(data[0].userTypeId);
                    let SubstituteModel = {
                        FirstName: data[0].firstName,
                        LastName: data[0].lastName,
                        UserTypeId: data[0].userTypeId,
                        IsCertified: String(data[0].isCertified),
                        IsSubscribedEmail: data[0].isSubscribedEmail ? '1' : '0',
                        IsSubscribedSMS: data[0].isSubscribedSMS ? '1' : '0',
                        Gender: String(data[0].gender),
                        District: data[0].districtId,
                        Email: data[0].email,
                        TeachingLevel: data[0].teachingLevel,
                        Speciality: data[0].speciality ? data[0].speciality : '',
                        PhoneNumber: data[0].phoneNumber,
                        PayRate: data[0].payRate as string,
                        HourLimit: data[0].hourLimit,
<<<<<<< HEAD
                        IsActive: data[0].isActive,
                        // Password: data[0].password
=======
                        IsActive: data[0].isActive
>>>>>>> ac3c34bef4eda9b5dad68d853de262020d5cf1e0
                    }
                    this.getImage(data[0].profilePicture);
                    this.substituteForm.setValue(SubstituteModel);
                    this.userIdForUpdate = SubstituteId;
                },
                    error => <any>error);
            }
            else {
                this.profilePicture = 'assets/Images/noimage.png';
            }
        });
    }

    getpositions(): void {
        let DistrictId = this._userSession.getUserDistrictId();
        this._dataContext.getById('user/positions', DistrictId).subscribe((data: any[]) => {
            this.positions = data.filter(t => t.isVisible === true);
        },
            error => this.msg = <any>error);
    }

    getImage(imageName: string) {
        if (imageName && imageName.length > 0) {
            this.profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl(environment.profileImageUrl + imageName);
            this.profilePictureUrl = imageName;
        }
    }

    GetUserTypes(): void {
        this._dataContext.get('user/getUserTypes').subscribe((data: any) => {
            this.userTypes = data;
        },
            error => <any>error);
    }

    GetDistricts(): void {
        this._dataContext.get('district/getDistricts').subscribe((data: any) => {
            this.Districts = data;
            if (this._userSession.getUserLevelId() != 4) {
                this.substituteForm.get('District').setValue(this._userSession.getUserDistrictId());
                this.substituteForm.controls['District'].disable();
            }
        },
            error => <any>error);
    }

    GetTeachingLevels(): void {
        this._dataContext.get('lookup/getTeachingLevels').subscribe((data: any) => {
            this.TeachingLevels = data;
        },
            error => this.msg = <any>error);
    }

    //ON CHANGING EMPLOYEE TYPE
    onChangeEmployeeType(value: any) {
        if (value === 1) {
            this.substituteForm.controls["TeachingLevel"].setValidators([Validators.required]);
            this.substituteForm.controls['TeachingLevel'].updateValueAndValidity();
        }
        else {
            this.substituteForm.controls['TeachingLevel'].clearValidators();
            this.substituteForm.controls['TeachingLevel'].updateValueAndValidity();
        }
    }

    // On Selecting Profile Image
    onSelectProfileImage(event: any) {
        if (event.target.files && event.target.files[0]) {
            let formData = new FormData();
            formData.append('UserId', this.userIdForUpdate);
            var mimeType = event.target.files[0].type;
            if (mimeType.match(/image\/*/) == null) {
                this.notifier.notify('error', 'Only images are supported.');
                return;
            }
            Array.from(event.target.files).forEach((file: File) => formData.append('file', file))
            this.fileService.uploadProfilePicture(formData)
                .subscribe(responseEvent => {
                    if (responseEvent.type === HttpEventType.UploadProgress) {

                    } else if (responseEvent instanceof HttpResponse) {
                        this.profilePictureUrl = responseEvent.body.toString();
                        var reader = new FileReader();
                        reader.readAsDataURL(event.target.files[0]);
                        reader.onload = (event: any) => {
                            this.profilePicture = event.target.result;
                        }
                    }
                });
        }
    }

    uploadClick() {
        const fileUpload = document.getElementById('UploadButton') as HTMLInputElement;
        fileUpload.click();
    }

    onSubmitSubstituteForm(form: any) {
        this.msg = "";
        if (this.substituteForm.valid) {
            let model = {
                UserId: this.userIdForUpdate,
                Email: form.value.Email
            }
            this.userService.post('user/verify', model).subscribe((result: any) => {
                if (result) {
                    this.notifier.notify('error', 'This email address belongs to another user. Please try with other one.');
                }
                else {
                    let model = {
                        UserId: this.userIdForUpdate,
                        FirstName: form.value.FirstName,
                        LastName: form.value.LastName,
                        UserTypeId: form.value.UserTypeId,
                        RoleId: 4,
                        // IF USER TYPE IS TEACHER
                        TeachingLevel: form.value.UserTypeId === 1 ? form.value.TeachingLevel : 0,
                        Speciality: form.value.UserTypeId === 1 ? form.value.Speciality : 'N/A',
                        Gender: form.value.Gender,
                        IsCertified: form.value.IsCertified,
                        IsSubscribedEmail: form.value.IsSubscribedEmail == '1' ? true : false,
                        IsSubscribedSMS: form.value.IsSubscribedSMS == '1' ? true : false,
                        DistrictId: form.getRawValue().District,
                        Email: form.value.Email,
                        PhoneNumber: form.value.PhoneNumber,
                        ProfilePicture: this.profilePictureUrl ? this.profilePictureUrl : 'noimage.png',
                        PayRate: form.value.PayRate,
                        HourLimit: form.value.HourLimit,
                        IsActive: form.value.IsActive,
                        Password: '1234567890'
                    }
                    if (this.userIdForUpdate && this.userIdForUpdate != 'undefined') {
                        this._dataContext.Patch('user/updateUser', model).subscribe((data: any) => {
                            this.router.navigate(['/manage/substitutes']);
                            this.notifier.notify('success', 'Updated Successfully');
                        },
                            (err: HttpErrorResponse) => {
                                this.notifier.notify('error', err.error.error_description);
                            });
                    }
                    else {
                        this._dataContext.post('user/insertUser', model).subscribe((data: any) => {
                            this.router.navigate(['/manage/substitutes']);
                            this.notifier.notify('success', 'Added Successfully');
                        },
                            (err: HttpErrorResponse) => {
                                this.notifier.notify('error', err.error.error_description);
                            });
                    }
                }
            });
        }
    }
}