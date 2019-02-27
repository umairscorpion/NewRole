import { Component, OnInit, ViewChild } from '@angular/core';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { DataContext } from '../../../../Services/dataContext.service';
import { UserSession } from '../../../../Services/userSession.service';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router, ActivatedRoute } from '@angular/router';
import { IStates } from '../../../../Model/Lookups/states';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs/Observable';
import { NotifierService } from 'angular-notifier';
@Component({
    templateUrl: 'addSubstitute.component.html'
})
export class AddSubstituteComponent implements OnInit {
    userIdForUpdate: any = null;
    profilePicture: any;
    private notifier: NotifierService;
    userTypes: any;
    TeachingLevels: any;
    Districts: any;
    states: Observable<IStates[]>;
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('modal') modal: ModalComponent;
    msg: string;
    substituteForm: FormGroup;
    constructor(private router: Router, private fb: FormBuilder, private _dataContext: DataContext,
        notifier: NotifierService, private route: ActivatedRoute, private _userSession : UserSession) {
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
            Gender: ['M', Validators.required],
            District: ['', Validators.required],
            Email: ['', [Validators.required, Validators.email]],
            PhoneNumber: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
        });
        this.GetUserTypes();
        this.GetDistricts();
        this.GetTeachingLevels();
        this.route.queryParams.subscribe((params: any) => {
            if (params['Id']) {
                let SubstituteId = params.Id;
                this._dataContext.getById('user/getUserById', SubstituteId).subscribe((data: any) => {
                    // To make validation of Speaciality and Teacher level when editing
                    this.onChangeEmployeeType(data[0].userTypeId);
                    let SubstituteModel = {
                        FirstName: data[0].firstName,
                        LastName: data[0].lastName,
                        UserTypeId: data[0].userTypeId,
                        IsCertified: String(data[0].isCertified),
                        Gender: String(data[0].gender),
                        District: data[0].districtId,
                        Email: data[0].email,
                        TeachingLevel: data[0].teachingLevel,
                        Speciality: data[0].speciality ? data[0].speciality : '',
                        PhoneNumber: data[0].phoneNumber
                    }
                    this.profilePicture = data[0].profilePicture ? data[0].profilePicture : 'assets/Images/noimage.png';
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

    GetUserTypes(): void {
        this._dataContext.get('user/getUserTypes').subscribe((data: any) => {
            this.userTypes = data;
        },
            error => <any>error);
    }

    GetDistricts(): void {
        this._dataContext.get('district/getDistricts').subscribe((data: any) => {
            this.Districts = data;
            this.substituteForm.get('District').setValue(this._userSession.getUserDistrictId());
            this.substituteForm.controls['District'].disable();
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
            this.substituteForm.controls["Speciality"].setValidators([Validators.required]);
            this.substituteForm.controls['TeachingLevel'].updateValueAndValidity();
            this.substituteForm.controls['Speciality'].updateValueAndValidity();
        }
        else {
            this.substituteForm.controls['TeachingLevel'].clearValidators();
            this.substituteForm.controls['Speciality'].clearValidators();
            this.substituteForm.controls['TeachingLevel'].updateValueAndValidity();
            this.substituteForm.controls['Speciality'].updateValueAndValidity();
        }
    }

    // On Selecting Profile Image
    onSelectProfileImage(event: any) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event: any) => {
                this.profilePicture = event.target.result;
            }
        }
    }

    onSubmitSubstituteForm(form: any) {
        this.msg = "";
        if (this.substituteForm.valid) {
            if (this.userIdForUpdate && this.userIdForUpdate !='undefined') {
                let model = {
                    UserId: this.userIdForUpdate,
                    FirstName: form.value.FirstName,
                    LastName: form.value.LastName,
                    UserTypeId: form.value.UserTypeId,
                    RoleId: 4,
                    // IF USER TYPE IS TEACHER
                    TeachingLevel: form.value.UserTypeId === 1 ? form.value.TeachingLevel : 0 ,
                    Speciality: form.value.UserTypeId === 1 ? form.value.Speciality : 'N/A',
                    Gender: form.value.Gender,
                    IsCertified: form.value.IsCertified,
                    DistrictId: form.getRawValue().District,
                    Email: form.value.Email,
                    PhoneNumber: form.value.PhoneNumber,
                    ProfilePicture: this.profilePicture,
                }
                this._dataContext.Patch('user/updateUser', model).subscribe((data: any) => {
                    this.router.navigate(['/manage/substitutes']);
                    this.notifier.notify('success', 'Updated Successfully');
                },
                    (err: HttpErrorResponse) => {
                        this.notifier.notify('error', err.error.error_description);
                    });
            }
            else {
                let model = {
                    FirstName: form.value.FirstName,
                    LastName: form.value.LastName,
                    UserTypeId: form.value.UserTypeId,
                    RoleId: 4,
                    // IF USER TYPE IS TEACHER
                    TeachingLevel: form.value.UserTypeId === 1 ? form.value.TeachingLevel : 0 ,
                    Speciality: form.value.UserTypeId === 1 ? form.value.Speciality : 'N/A',
                    Gender: form.value.Gender,
                    IsCertified: form.value.IsCertified,
                    DistrictId: form.getRawValue().District,
                    Email: form.value.Email,
                    PhoneNumber: form.value.PhoneNumber,
                    ProfilePicture: this.profilePicture
                }
                this._dataContext.post('user/insertUser', model).subscribe((data: any) => {
                    this.router.navigate(['/manage/substitutes']);
                    this.notifier.notify('success', 'Added Successfully');
                },
                    (err: HttpErrorResponse) => {
                        this.notifier.notify('error', err.error.error_description);
                    });
            }
        }
    }
}