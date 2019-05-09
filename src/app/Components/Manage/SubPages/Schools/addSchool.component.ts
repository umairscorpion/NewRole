import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDistrict } from '../../../../Model/Manage/district';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { DataContext } from '../../../../Services/dataContext.service';
@Component({
    templateUrl: 'addSchool.component.html'
})
export class AddSchoolComponent implements OnInit {
    private notifier: NotifierService;
    SchoolIdForUpdate: any = null;
    Districts: IDistrict[];
    msg: string;
    schoolForm: FormGroup;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;
    constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute,
        notifier: NotifierService, private _dataContext: DataContext) {
        this.notifier = notifier;
    }
    ngOnInit(): void {
        this.GetDistricts();
        this.GenerateSchoolForm();
        this.GetSchoolInformationOnEditing();
    }

    GenerateSchoolForm(): void {
        this.schoolForm = this.fb.group({
            Name: ['', Validators.required],
            district: [null, Validators.required],
            Address: ['', Validators.required],
            ZipCode: ['', Validators.required],
            City: ['', Validators.required],
            StartTime: ['', Validators.required],
            firstHalfEndTime: ['', Validators.required],
            SecondHalfStartTime: ['', Validators.required],
            EndTime: ['', Validators.required],
            TimeZone: [null, Validators.required],
            PhoneNo: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
            releaseJobTime: [''],
            notifyOthersTime: [''],
            dailyAbenceLimit: [''],
            isAbsenceLimit: ['']
            // NoOfEmployees: ['', Validators.required],
            // EmailId: ['', [Validators.required, Validators.email]],
        });
    }

    GetSchoolInformationOnEditing(): void {
        this.route.queryParams.subscribe((params: any) => {
            if (params['Id']) {
                let SchoolId = params.Id;
                this._dataContext.getById('School/getSchoolById', SchoolId).subscribe((data: any) => {
                    let SchoolModel = {
                        Name: data[0].schoolName,
                        district: data[0].schoolDistrictId,
                        Address: data[0].schoolAddress,
                        ZipCode: data[0].schoolZipCode,
                        City: data[0].schoolCity,
                        StartTime: data[0].schoolStartTime,
                        firstHalfEndTime: data[0].school1stHalfEnd,
                        SecondHalfStartTime: data[0].school2ndHalfStart,
                        EndTime: data[0].schoolEndTime,
                        TimeZone: data[0].schoolTimeZone,
                        PhoneNo: data[0].schoolPhone,
                        releaseJobTime: data[0].releaseJobTime,
                        notifyOthersTime: data[0].notifyOthersTime,
                        dailyAbenceLimit: data[0].dailyAbenceLimit,
                        isAbsenceLimit: data[0].isAbsenceLimit
                    }
                    this.schoolForm.setValue(SchoolModel);
                    this.SchoolIdForUpdate = SchoolId;
                },
                    error => <any>error);
            }
        });
    }

    GetDistricts(): void {
        this._dataContext.get('district/getDistricts').subscribe((data: any) => {
            this.Districts = data;
        },
            error => <any>error);
    }
    onSubmit(form: any) {
        if (this.schoolForm.valid) {
            if (this.CheckTime(form.value)) {
                if (this.SchoolIdForUpdate != null) {
                    let model = {
                        SchoolId: this.SchoolIdForUpdate,
                        SchoolName: form.value.Name,
                        SchoolDistrictId: form.value.district,
                        SchoolCity: form.value.City,
                        SchoolAddress: form.value.Address,
                        SchoolZipCode: form.value.ZipCode,
                        SchoolStartTime: form.value.StartTime,
                        School1stHalfEnd: form.value.firstHalfEndTime,
                        School2ndHalfStart: form.value.SecondHalfStartTime,
                        SchoolEndTime: form.value.EndTime,
                        SchoolTimeZone: form.value.TimeZone,
                        SchoolPhone: form.value.PhoneNo,
                        releaseJobTime: form.value.releaseJobTime,
                        notifyOthersTime: form.value.notifyOthersTime,
                        dailyAbenceLimit: form.value.dailyAbenceLimit,
                        isAbsenceLimit: form.value.isAbsenceLimit
                    }
                    this._dataContext.Patch('school/updateSchool', model).subscribe((data: any) => {
                        this.notifier.notify('success', 'Updated Successfully.');
                        this.router.navigate(['/manage/schools']);
                    },
                        (err: HttpErrorResponse) => {
                            this.notifier.notify('error', err.message);
                        });
                }
                else {
                    let model = {
                        SchoolName: form.value.Name,
                        SchoolDistrictId: form.value.district,
                        SchoolCity: form.value.City,
                        SchoolAddress: form.value.Address,
                        SchoolZipCode: form.value.ZipCode,
                        SchoolStartTime: form.value.StartTime,
                        School1stHalfEnd: form.value.firstHalfEndTime,
                        School2ndHalfStart: form.value.SecondHalfStartTime,
                        SchoolEndTime: form.value.EndTime,
                        SchoolTimeZone: form.value.TimeZone,
                        SchoolPhone: form.value.PhoneNo
                    }
                    this._dataContext.post('school/insertSchool', model).subscribe((data: any) => {
                        this.notifier.notify('success', 'Saved Successfully.');
                        this.router.navigate(['/manage/schools']);
                    },
                        (err: HttpErrorResponse) => {
                            this.notifier.notify('error', err.message);
                        });
                }
            }
        }
    }

    CheckTime(school: any): boolean {
        if (school.StartTime > school.EndTime || school.firstHalfEndTime > school.SecondHaifStartTime ||
            school.StartTime > school.SecondHaifStartTime || school.StartTime > school.firstHalfEndTime ||
            school.EndTime < school.StartTime || school.EndTime < school.SecondHaifStartTime ||
            school.EndTime < school.firstHalfEndTime) {
            this.notifier.notify('error', 'Please enter valid time.');
            return false;
        }
        return true;
    }
}