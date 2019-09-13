import { Component, OnInit } from '@angular/core';
import { DataContext } from '../../../../Services/dataContext.service';
import { UserSession } from '../../../../Services/userSession.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse, HttpEventType } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { FileService } from '../../../../Services/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/Service/user.service';
import { environment } from 'src/environments/environment';
import { RoleService } from '../../../../Services/role.service';

@Component({
    templateUrl: 'addEmployees.component.html',
    styleUrls: ['employee.component.css']
})
export class AddEmployeesComponent implements OnInit {

    userIdForUpdate: any = null;
    sendWelcomeEmailId: any = null;
    profilePictureUrl: string
    profilePicture: any;
    private notifier: NotifierService;
    userTypes: any;
    roles: any;
    Districts: any;
    Organizations: any;
    TeachingLevels: any;
    teachingSubjects: any;
    msg: string;
    employeeForm: FormGroup;
    UserClaim = JSON.parse(localStorage.getItem('userClaims'));
    // These two variables are used to show and hid district and school but not in use may be reqired. So dont remove it.
    showDistrict: boolean = true;
    showOrganization: boolean = false;
    countryCode: string;
    loginUserId: any;
    loginUserRoleId: any;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private _dataContext: DataContext,
        notifier: NotifierService,
        private route: ActivatedRoute,
        private _userSession: UserSession,
        private fileService: FileService,
        private sanitizer: DomSanitizer,
        private userService: UserService,
        private roleService: RoleService, ) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.loadData();
        this.loginUserId = this._userSession.getUserId();
        this.loginUserRoleId = this._userSession.getUserRoleId();
        this.employeeForm = this.fb.group({
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            UserTypeId: ['', Validators.required],
            WorkLocaion: ['1'],
            TeachingLevel: [''],
            Speciality: [''],
            IsCertified: ['1', Validators.required],
            IsSubscribedEmail: ['1', Validators.required],
            IsSubscribedSMS: ['1', Validators.required],
            Gender: ['M', Validators.required],
            District: ['', Validators.required],
            role: ['', Validators.required],
            OrganizationId: [''],
            SecondarySchools: [],
            EmailId: ['', [Validators.required, Validators.email]],
            PhoneNumber: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
            IsActive: [1],
        });
        if (this.loginUserRoleId == 2) {
            this.employeeForm.get('WorkLocaion').setValue('2');
            this.employeeForm.controls['WorkLocaion'].disable();
            this.employeeForm.controls['WorkLocaion'].updateValueAndValidity();
            this.showOrganization = true;
            this.showDistrict = false;
        }

        this.GetUserTypes();
        this.GetDistricts();
        this.GetOrganiations();
        this.GetTeachingLevels();
        this.GetTeachingSubjects();

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
                        Speciality: data[0].specialityTypeId,
                        WorkLocaion: data[0].organizationId ? '2' : '1',
                        IsCertified: String(data[0].isCertified),
                        IsSubscribedEmail: data[0].isSubscribedEmail ? '1' : '0',
                        IsSubscribedSMS: data[0].isSubscribedSMS ? '1' : '0',
                        Gender: String(data[0].gender),
                        District: data[0].districtId,
                        OrganizationId: data[0].organizationId ? data[0].organizationId : '',
                        SecondarySchools: data[0].secondarySchools,
                        PhoneNumber: this.getPhoneNumber(data[0].phoneNumber, data[0].counrtyCode),
                        IsActive: data[0].isActive,
                        role: data[0].roleId
                    }
                    this.getImage(data[0].profilePicture);
                    this.employeeForm.setValue(EmployeeModel);
                    this.userIdForUpdate = EmployeeId;
                    this.countryCode = data[0].counrtyCode
                    this.onChangeDistrict(data[0].districtId);
                },
                    error => <any>error);
            }
            else {
                this.profilePicture = 'assets/Images/noimage.png';
            }
        });
    }

    getPhoneNumber(phoneNumber: string, counrtyCode: string): string {
        phoneNumber = phoneNumber.includes(counrtyCode) ? phoneNumber.split(counrtyCode)[1] : phoneNumber;
        return phoneNumber;
    }

    setCountryCode(countryCode) {
        this.countryCode = countryCode;
    }

    loadData() {
        this.roleService.get('roles').subscribe(roles => { this.roles = roles; });
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
        this._dataContext.get('district/getDistricts').subscribe((data: any[]) => {
            this.Districts = data;
            if (this._userSession.getUserRoleId() == 5) {
                this.employeeForm.controls['District'].enable();
            }
            else {
                const dist = this.Districts.filter(dis => dis.districtId == this._userSession.getUserDistrictId());
                this.countryCode = dist[0].counrtyCode;
                this.employeeForm.get('District').setValue(this._userSession.getUserDistrictId());
                this.employeeForm.controls['District'].disable();
            }
        },
            error => <any>error);
    }

    GetOrganiations(): void {
        this._dataContext.get('school/getSchools').subscribe((data: any) => {
            this.Organizations = data;
            this.Organizations = data.filter(t => t.schoolDistrictId == this._userSession.getUserDistrictId());
            if (this._userSession.getUserRoleId() == 2) {
                this.employeeForm.get('OrganizationId').setValue(this._userSession.getUserOrganizationId());
                this.employeeForm.controls['OrganizationId'].disable();
            }
        },
            error => this.msg = <any>error);
    }

    onChangeDistrict(districtId: any) {
        this._dataContext.get('school/getSchools').subscribe((data: any) => {
            this.Organizations = data;
            this.Organizations = data.filter(t => t.schoolDistrictId == districtId);
        },
            error => this.msg = <any>error);
    }

    GetTeachingLevels(): void {
        this._dataContext.get('lookup/getTeachingLevels').subscribe((data: any) => {
            this.TeachingLevels = data;
        },
            error => this.msg = <any>error);
    }

    GetTeachingSubjects(): void {
        this._dataContext.get('lookup/teachingSubjects').subscribe((data: any) => {
            this.teachingSubjects = data;
        },
            error => this.msg = <any>error);
    }

    ManageDefultValuesAgainstDifferentUserRoles() {

    }

    OnchangeWorkLocation(event: any) {
        if (+event === 2) {
            this.employeeForm.get('role').setValue(2);
            this.employeeForm.controls["OrganizationId"].setValidators([Validators.required]);
            this.employeeForm.controls['OrganizationId'].updateValueAndValidity();
            this.showOrganization = true;
            this.showDistrict = false;
        }
        else {
            this.employeeForm.get('role').setValue(1);
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
        if (value == 1) {
            this.employeeForm.controls["TeachingLevel"].setValidators([Validators.required]);
            this.employeeForm.controls["Speciality"].setValidators([Validators.required]);
            this.employeeForm.controls['TeachingLevel'].updateValueAndValidity();
            this.employeeForm.controls['Speciality'].updateValueAndValidity();
        } else {
            this.employeeForm.controls['TeachingLevel'].clearValidators();
            this.employeeForm.controls['Speciality'].clearValidators();
            this.employeeForm.controls['TeachingLevel'].updateValueAndValidity();
            this.employeeForm.controls['Speciality'].updateValueAndValidity();
        }
        if (value !== 2 || value !== 3 || value !== 4) {
            this.employeeForm.get('SecondarySchools').setValue([]);
            // this.employeeForm.controls["TeachingLevel"].setValidators([Validators.required]);
            // this.employeeForm.controls["Speciality"].setValidators([Validators.required]);
            // this.employeeForm.controls['TeachingLevel'].updateValueAndValidity();
            // this.employeeForm.controls['Speciality'].updateValueAndValidity();
        }
        else {
            // this.employeeForm.controls['TeachingLevel'].clearValidators();
            // this.employeeForm.controls['Speciality'].clearValidators();
            // this.employeeForm.controls['TeachingLevel'].updateValueAndValidity();
            // this.employeeForm.controls['Speciality'].updateValueAndValidity();
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

    onSelectPrimarySchool(schoolId: string) {
        const secondarySchools: string[] = Array<string>();
        secondarySchools.push(schoolId);
        this.employeeForm.get('SecondarySchools').setValue(secondarySchools);

    }

    InsertUser() {
        this.sendWelcomeEmailId = 1;
    }

    onSubmitEmployeeForm(form: any) {
        this.msg = "";
        if (this.employeeForm.valid) {
            let model = {
                UserId: this.userIdForUpdate,
                Email: form.value.EmailId
            }
            this.userService.post('user/verify', model).subscribe((result: any) => {
                if (result) {
                    this.notifier.notify('error', 'This email address belongs to another user. Please try with other one.');
                }
                // form.value.UserTypeId === 2 && this.showOrganization == true && typeof form.getRawValue().OrganizationId != 'undefined' && form.getRawValue().OrganizationId ? 2 :
                //             form.value.UserTypeId === 2 && this.showDistrict == true && typeof form.getRawValue().District != 'undefined' && form.getRawValue().District ? 1 : 3
                else {
                    let model = {
                        UserId: this.userIdForUpdate,
                        FirstName: form.value.FirstName,
                        LastName: form.value.LastName,
                        UserTypeId: form.value.UserTypeId,
                        //IF USER TYPE IS 2 i.e ADMIN AND SHOW ORGANIZTION IS TRUE THAN ITS ORGANIZATION ADMIN
                        //IF USER TYPE IS 2 i.e ADMIN AND SHOW DISTRICT IS TRUE THAN ITS DISTRICT ADMIN
                        //IF BOTH SCENARIOS ARE FALSE THAN ITS EMPLOYEE ADMIN
                        RoleId: form.value.role,
                        // IF USER TYPE IS TEACHER
                        TeachingLevel: form.value.UserTypeId === 1 ? form.value.TeachingLevel : 0,
                        specialityTypeId: form.value.UserTypeId === 1 ? form.value.Speciality : 0,
                        Gender: form.value.Gender,
                        IsCertified: form.value.IsCertified,
                        IsSubscribedEmail: form.value.IsSubscribedEmail == '1' ? true : false,
                        IsSubscribedSMS: form.value.IsSubscribedSMS == '1' ? true : false,
                        DistrictId: typeof form.getRawValue().District != 'undefined' && form.getRawValue().District ? form.getRawValue().District : 0,
                        OrganizationId: this.showOrganization == true ? form.getRawValue().OrganizationId : '',
                        SecondarySchools: form.value.SecondarySchools && this.showOrganization == true ? form.value.SecondarySchools.filter((school: any) => school !== form.getRawValue().OrganizationId) : null,
                        Email: form.value.EmailId,
                        PhoneNumber: this.countryCode + form.value.PhoneNumber,
                        ProfilePicture: this.profilePictureUrl ? this.profilePictureUrl : 'noimage.png',
                        IsActive: form.value.IsActive,
                        Password: 'Password1',
                        CreatedBy: this.loginUserId,
                        ModifiedBy: this.loginUserId
                    }

                    if (this.userIdForUpdate && this.userIdForUpdate != 'undefined') {
                        this._dataContext.Patch('user/updateUser', model).subscribe((data: any) => {
                            this.router.navigate(['/manage/employees']);
                            this.notifier.notify('success', 'Updated Successfully');
                        },
                            (err: HttpErrorResponse) => {
                                this.notifier.notify('error', err.error.error_description);
                            });
                    }
                    else if (this.sendWelcomeEmailId == 1) {
                        this._dataContext.post('user/insertUserAndSendWelcomeEmail', model).subscribe((data: any) => {
                            this.router.navigate(['/manage/employees']);
                            this.notifier.notify('success', 'Added Successfully');
                        },
                            (err: HttpErrorResponse) => {
                                this.notifier.notify('error', err.error.error_description);
                            });
                    }
                    else {
                        this._dataContext.post('user/insertUser', model).subscribe((data: any) => {
                            this.router.navigate(['/manage/employees']);
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