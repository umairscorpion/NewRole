import { Component, OnInit } from '@angular/core';
import { DataContext } from '../../../../Services/dataContext.service';
import { UserSession } from '../../../../Services/userSession.service';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
@Component({
    templateUrl: 'addEmployees.component.html'
})
export class AddEmployeesComponent implements OnInit {
    userIdForUpdate: any = null;
    profilePicture: any;
    private notifier: NotifierService;
    userTypes: any;
    Districts: any;
    Organizations: any;
    TeachingLevels: any;
    msg: string;
    employeeForm: FormGroup;
    UserClaim = JSON.parse(localStorage.getItem('userClaims'));
    // These two variables are used to show and hid district and school but not in use may be reqired. So dont remove it.
    showDistrict: boolean = true;
    showOrganization: boolean = false;
    constructor(private router: Router, private fb: FormBuilder, private _dataContext: DataContext,
        notifier: NotifierService, private route: ActivatedRoute, private _userSession : UserSession) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.employeeForm = this.fb.group({
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            UserTypeId: ['', Validators.required],
            WorkLocaion : ['1'],
            TeachingLevel: [''],
            Speciality: [''],
            IsCertified: ['1', Validators.required],
            Gender: ['M', Validators.required],
            District: ['', Validators.required],
            OrganizationId: [''],
            EmailId: ['', [Validators.required, Validators.email]],
            PhoneNumber: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
        });
        if(this._userSession.getUserRoleId() == 2)
        {
            this.employeeForm.get('WorkLocaion').setValue('2');
            this.employeeForm.controls['WorkLocaion'].disable();
            this.showOrganization = true;
            this.showDistrict = false;
        }
        
        this.GetUserTypes();
        this.GetDistricts();
        this.GetOrganiations();
        this.GetTeachingLevels();
        
        this.route.queryParams.subscribe((params: any) => {
            if (params['Id']) {
                let EmployeeId = params.Id;
                this._dataContext.getById('user/getUserById', EmployeeId).subscribe((data: any) => {
                    // To make validation of Speaciality and Teacher level when editing
                    this.onChangeEmployeeType(data[0].userTypeId);
                    this.OnchangeWorkLocation(data[0].organizationId ? 2 : 1);
                    let EmployeeModel = {
                        FirstName: data[0].firstName,
                        LastName: data[0].lastName,
                        UserTypeId: data[0].userTypeId,
                        EmailId: data[0].email,
                        TeachingLevel: data[0].teachingLevel,
                        Speciality: data[0].speciality ? data[0].speciality : '',
                        WorkLocaion: data[0].organizationId ? '2' : '1',
                        IsCertified: String(data[0].isCertified),
                        Gender: String(data[0].gender),
                        District: data[0].districtId,
                        OrganizationId: data[0].organizationId ? data[0].organizationId : '',
                        PhoneNumber: data[0].phoneNumber
                    }
                    this.profilePicture = data[0].profilePicture ? data[0].profilePicture : 'assets/Images/noimage.png';
                    this.employeeForm.setValue(EmployeeModel);
                    this.userIdForUpdate = EmployeeId;
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
            this.employeeForm.get('District').setValue(this._userSession.getUserDistrictId());
            this.employeeForm.controls['District'].disable();
        },
            error => <any>error);
    }

    GetOrganiations(): void {
        this._dataContext.get('school/getSchools').subscribe((data: any) => {
            this.Organizations = data;
            if(this._userSession.getUserRoleId() == 2) {
                this.employeeForm.get('OrganizationId').setValue(this._userSession.getUserOrganizationId());
                this.employeeForm.controls['OrganizationId'].disable();
            }
        },
            error => this.msg = <any>error);
    }

    GetTeachingLevels(): void {
        this._dataContext.get('lookup/getTeachingLevels').subscribe((data: any) => {
            this.TeachingLevels = data;
        },
            error => this.msg = <any>error);
    }

    ManageDefultValuesAgainstDifferentUserRoles() {

    }

    OnchangeWorkLocation(event: any) {
        if (event.value == 2) {
            this.employeeForm.controls["OrganizationId"].setValidators([Validators.required]);
            this.employeeForm.controls['OrganizationId'].updateValueAndValidity();
            this.employeeForm.controls['District'].clearValidators();
            this.employeeForm.controls['District'].updateValueAndValidity();
            this.showOrganization = true;
            this.showDistrict = false;
        }
        else {
            this.employeeForm.controls['OrganizationId'].clearValidators();
            this.employeeForm.controls["District"].setValidators([Validators.required]);
            this.employeeForm.controls['District'].updateValueAndValidity();
            this.employeeForm.controls['OrganizationId'].updateValueAndValidity();
            this.showDistrict = true;
            this.showOrganization = false;
        }
    }

    //ON CHANGING EMPLOYEE TYPE
    onChangeEmployeeType(value: any) {
        if (value === 1) {
            this.employeeForm.controls["TeachingLevel"].setValidators([Validators.required]);
            this.employeeForm.controls["Speciality"].setValidators([Validators.required]);
            this.employeeForm.controls['TeachingLevel'].updateValueAndValidity();
            this.employeeForm.controls['Speciality'].updateValueAndValidity();
        }
        else {
            this.employeeForm.controls['TeachingLevel'].clearValidators();
            this.employeeForm.controls['Speciality'].clearValidators();
            this.employeeForm.controls['TeachingLevel'].updateValueAndValidity();
            this.employeeForm.controls['Speciality'].updateValueAndValidity();
        }
    }
    // On Selecting Profile Image
    onSelectProfileImage(event :any) {
        if (event.target.files && event.target.files[0]) {
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event : any) => {
            this.profilePicture = event.target.result;
          }
        }
    }

    onSubmitEmployeeForm(form: any) {
        this.msg = "";
        if (this.employeeForm.valid) {
            if (this.userIdForUpdate && this.userIdForUpdate !='undefined') {
                let model = {
                    UserId: this.userIdForUpdate,
                    FirstName: form.value.FirstName,
                    LastName: form.value.LastName,
                    UserTypeId: form.value.UserTypeId,
                    //IF USER TYPE IS 2 i.e ADMIN AND SHOW ORGANIZTION IS TRUE THAN ITS ORGANIZATION ADMIN
                    //IF USER TYPE IS 2 i.e ADMIN AND SHOW DISTRICT IS TRUE THAN ITS DISTRICT ADMIN
                    //IF BOTH SCENARIOS ARE FALSE THAN ITS EMPLOYEE ADMIN
                    RoleId: form.value.UserTypeId === 2 && this.showOrganization == true && typeof form.getRawValue().OrganizationId !='undefined' && form.getRawValue().OrganizationId ? 2 :
                             form.value.UserTypeId === 2 && this.showDistrict == true && typeof form.getRawValue().District !='undefined' && form.getRawValue().District ? 1: 3,
                    // IF USER TYPE IS TEACHER
                    TeachingLevel: form.value.UserTypeId === 1 ? form.value.TeachingLevel : 0 ,
                    Speciality: form.value.UserTypeId === 1 ? form.value.Speciality : 'N/A',
                    Gender: form.value.Gender,
                    IsCertified: form.value.IsCertified,
                    DistrictId: typeof form.getRawValue().District !='undefined' && form.getRawValue().District ? form.getRawValue().District : 0,
                    OrganizationId: this.showOrganization == true ? form.getRawValue().OrganizationId : '',
                    Email: form.value.EmailId,
                    PhoneNumber: form.value.PhoneNumber,
                    ProfilePicture: this.profilePicture
                }
                this._dataContext.Patch('user/updateUser', model).subscribe((data: any) => {
                    // this.router.navigate(['/manage/substitutes']);
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
                    //IF USER TYPE IS 2 i.e ADMIN AND SHOW ORGANIZTION IS TRUE THAN ITS ORGANIZATION ADMIN
                    //IF USER TYPE IS 2 i.e ADMIN AND SHOW DISTRICT IS TRUE THAN ITS DISTRICT ADMIN
                    //IF BOTH SCENARIOS ARE FALSE THAN ITS EMPLOYEE ADMIN
                    RoleId: form.value.UserTypeId === 2 && this.showOrganization == true && typeof form.getRawValue().OrganizationId !='undefined' && form.getRawValue().OrganizationId ? 2 :
                             form.value.UserTypeId === 2 && this.showDistrict == true && typeof form.getRawValue().District !='undefined' && form.getRawValue().District ? 1: 3,
                    // IF USER TYPE IS TEACHER
                    TeachingLevel: form.value.UserTypeId === 1 ? form.value.TeachingLevel : 0 ,
                    Speciality: form.value.UserTypeId === 1 ? form.value.Speciality : 'N/A',
                    Gender: form.value.Gender,
                    IsCertified: form.value.IsCertified,
                    DistrictId: typeof form.getRawValue().District !='undefined' && form.getRawValue().District ? form.getRawValue().District : 0,
                    OrganizationId: form.getRawValue().OrganizationId,
                    Email: form.value.EmailId,
                    PhoneNumber: form.value.PhoneNumber,
                    ProfilePicture: this.profilePicture ? this.profilePicture : 'assets/Images/noimage.png'
                }

                this._dataContext.post('user/insertUser', model).subscribe((data: any) => {
                    // this.router.navigate(['/manage/substitutes']);
                    this.notifier.notify('success', 'Added Successfully');
                },
                    (err: HttpErrorResponse) => {
                        this.notifier.notify('error', err.error.error_description);
                    });
            }
        }
    }
}