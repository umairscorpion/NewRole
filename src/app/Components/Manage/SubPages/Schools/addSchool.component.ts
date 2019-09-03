import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDistrict } from '../../../../Model/Manage/district';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { DataContext } from '../../../../Services/dataContext.service';
import { DistrictService } from 'src/app/Service/Manage/district.service';
import { ICountry } from 'src/app/Model/Lookups/country';
import { Observable } from 'rxjs/Observable';
import { IStates } from 'src/app/Model/Lookups/states';

@Component({
    templateUrl: 'addSchool.component.html'
})
export class AddSchoolComponent implements OnInit {
    private notifier: NotifierService;
    SchoolIdForUpdate: any = null;
    Districts: IDistrict[];
    countries: ICountry[];
    states: Observable<IStates[]>;
    timezones: any;
    msg: string;
    schoolForm: FormGroup;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;
    countryCode: string;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private _dataContext: DataContext,
        notifier: NotifierService,
        private _districtService: DistrictService) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.GetDistricts();
        this.GetTimeZone();
        this.GenerateSchoolForm();
        this.GetSchoolInformationOnEditing();
        this.GetCountries();
    }

    GenerateSchoolForm(): void {
        this.schoolForm = this.fb.group({
            Name: ['', Validators.required],
            district: [null, Validators.required],
            Address: ['', Validators.required],
            ZipCode: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
            City: ['', Validators.required],
            StartTime: ['', Validators.required],
            firstHalfEndTime: ['', Validators.required],
            SecondHalfStartTime: ['', Validators.required],
            EndTime: ['', Validators.required],
            TimeZone: [''],
            PhoneNo: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
            releaseJobTime: ['0'],
            notifyOthersTime: ['0'],
            dailyAbenceLimit: [0],
            isAbsenceLimit: [false],
            IsActive: [1],
            Country: [[], Validators.required],
            State: ['', Validators.required],
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
                        PhoneNo: this.getPhoneNumber(data[0].schoolPhone, data[0].counrtyCode),
                        releaseJobTime: data[0].releaseJobTime,
                        notifyOthersTime: data[0].notifyOthersTime,
                        dailyAbenceLimit: data[0].dailyAbenceLimit,
                        isAbsenceLimit: data[0].isAbsenceLimit,
                        IsActive: data[0].isActive,
                        Country: data[0].countryId,
                        State: data[0].schoolStateId,
                    }
                    this.schoolForm.setValue(SchoolModel);
                    this.states = this._districtService.getStatesByCountryId('districtLookup/getStateByCountryId', data[0].countryId);
                    this.schoolForm.get('State').setValue(data[0].schoolStateId);
                    this.SchoolIdForUpdate = SchoolId;
                    this.countryCode = data[0].counrtyCode;
                },
                    error => <any>error);
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

    GetDistricts(): void {
        this._dataContext.get('district/getDistricts').subscribe((data: any) => {
            this.Districts = data;
        },
            error => <any>error);
    }

    GetCountries(): void {
        this._districtService.getCountries('districtLookup/getCountries').subscribe((data: any) => {
            this.countries = data;
        },
            error => <any>error);
    }

    GetTimeZone(): void {
        this._districtService.getCountries('districtLookup/getTimeZone').subscribe((data: any) => {
            this.timezones = data;
        },
            error => <any>error);
    }

    onChange(countryId: any) {
        this.states = this._districtService.getStatesByCountryId('districtLookup/getStateByCountryId', countryId);
        this.schoolForm.controls['State'].setErrors({ 'incorrect': true });
    }

    onSubmit(form: any) {
        if (this.schoolForm.valid) {
            if (this.CheckTime(form.value)) {
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
                    SchoolPhone: this.countryCode + form.value.PhoneNo,
                    releaseJobTime: form.value.releaseJobTime,
                    notifyOthersTime: form.value.notifyOthersTime,
                    dailyAbenceLimit: form.value.dailyAbenceLimit,
                    isAbsenceLimit: form.value.isAbsenceLimit,
                    IsActive: form.value.IsActive,
                    CountryId: form.value.Country,
                    SchoolStateId: form.value.State,
                }
                if (this.SchoolIdForUpdate != null) {
                    this._dataContext.Patch('school/updateSchool', model).subscribe((data: any) => {
                        this.router.navigate(['/manage/schools']);
                        this.notifier.notify('success', 'Updated Successfully.');
                    },
                        (err: HttpErrorResponse) => {
                            this.notifier.notify('error', err.message);
                        });
                }
                else {
                    this._dataContext.post('school/insertSchool', model).subscribe((data: any) => {
                        this.router.navigate(['/manage/schools']);
                        this.notifier.notify('success', 'Saved Successfully.');
                    },
                        (err: HttpErrorResponse) => {
                            this.notifier.notify('error', err.message);
                        });
                }
            }
        }
    }

    CheckTime(school: any): boolean {
        if (school.StartTime > school.EndTime) {
            this.schoolForm.get('StartTime').setValue(null);
            this.schoolForm.get('EndTime').setValue(null);
        }
        if (school.firstHalfEndTime > school.SecondHaifStartTime) {
            this.schoolForm.get('firstHalfEndTime').setValue(null);
            this.schoolForm.get('SecondHaifStartTime').setValue(null);
        }
        if (school.StartTime > school.SecondHaifStartTime) {
            this.schoolForm.get('StartTime').setValue(null);
            this.schoolForm.get('SecondHaifStartTime').setValue(null);
        }
        if (school.StartTime > school.firstHalfEndTime) {
            this.schoolForm.get('StartTime').setValue(null);
            this.schoolForm.get('firstHalfEndTime').setValue(null);
        }
        if (school.EndTime < school.StartTime) {
            this.schoolForm.get('EndTime').setValue(null);
            this.schoolForm.get('StartTime').setValue(null);
        }
        if (school.EndTime < school.SecondHaifStartTime) {
            this.schoolForm.get('EndTime').setValue(null);
        }
        if (school.EndTime < school.firstHalfEndTime) {
            this.schoolForm.get('EndTime').setValue(null);
        }
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