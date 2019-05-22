import { Component, OnInit } from '@angular/core';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ICountry } from '../../../../Model/Lookups/country';
import { IStates } from '../../../../Model/Lookups/states';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs/Observable';
import { DataContext } from '../../../../Services/dataContext.service';
@Component({
    templateUrl: 'addOrganization.component.html'
})
export class AddOrganizationComponent implements OnInit {
    private notifier: NotifierService;
    countries: ICountry[];
    states: Observable<IStates[]>;
    msg: string;
    organizationForm: FormGroup;
    OrganizationIdForUpdate: any = 0;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private _districtService: DistrictService,
        private _dataContext: DataContext,
        notifier: NotifierService) {
        this.notifier = notifier;
    }
    ngOnInit(): void {
        this.organizationForm = this.fb.group({
            Name: ['', Validators.required],
            City: ['', Validators.required],
            Address: [''],
            ZipCode: [''],
            Country: [''],
            State: [''],
            TimeZone: [''],
            PhoneNo: ['', Validators.required],
            NoSchools: [''],
            NoUsers: ['', Validators.required],
            IsActive: [1]
        });
        this.GetCountries();
        this.route.queryParams.subscribe((params: any) => {
            if (params['Id']) {
                let DistrictId = params.Id;
                this._dataContext.getById('district/getDistrictById', DistrictId).subscribe((data: any) => {
                    let DistrictModel = {
                        Name: data[0].districtName,
                        City: data[0].city,
                        Address: data[0].districtAddress,
                        ZipCode: data[0].districtZipCode,
                        Country: data[0].countryId,
                        State: data[0].districtStateId,
                        StartTime: data[0].districtStartTime,
                        firstHalfEndTime: data[0].district1stHalfEnd,
                        SecondHaifStartTime: data[0].district2ndHalfStart,
                        EndTime: data[0].districtEndTime,
                        TimeZone: data[0].districtTimeZone,
                        PhoneNo: data[0].districtPhone,
                        IsActive: data[0].isActive
                    }
                    this.organizationForm.setValue(DistrictModel);
                    this.states = this._districtService.getStatesByCountryId('districtLookup/getStateByCountryId', data[0].countryId);
                    this.organizationForm.get('State').setValue(data[0].districtStateId);
                    this.OrganizationIdForUpdate = DistrictId;
                },
                    error => <any>error);
            }
        });
    }

    GetCountries(): void {
        this._districtService.getCountries('districtLookup/getCountries').subscribe((data: any) => {
            this.countries = data;
        },
            error => <any>error);
    }

    onChange(countryId: any) {
        this.states = this._districtService.getStatesByCountryId('districtLookup/getStateByCountryId', countryId);
    }

    onSubmit(form: any) {
        if (this.organizationForm.valid) {
            if (this.CheckTime(form.value)) {
                let model = {
                    DistrictId: this.OrganizationIdForUpdate,
                    DistrictName: form.value.Name,
                    City: form.value.City,
                    DistrictAddress: form.value.Address,
                    DistrictZipCode: form.value.ZipCode,
                    CountryId: form.value.Country,
                    DistrictStateId: form.value.State,
                    DistrictStartTime: form.value.StartTime,
                    District1stHalfEnd: form.value.firstHalfEndTime,
                    District2ndHalfStart: form.value.SecondHaifStartTime,
                    DistrictEndTime: form.value.EndTime,
                    DistrictTimeZone: form.value.TimeZone,
                    DistrictPhone: form.value.PhoneNo,
                    IsActive: form.value.IsActive
                }
                if (this.OrganizationIdForUpdate > 0) {

                    this._dataContext.Patch('district/updateDistrict', model).subscribe((data: any) => {
                        this.notifier.notify('success', 'Updated Successfully.');
                    },
                        (err: HttpErrorResponse) => {
                            this.notifier.notify('error', err.error.error_description);
                        });
                }
                else {
                    this._districtService.post('District/insertDistrict', model).subscribe((data: any) => {
                        this.notifier.notify('success', 'Saved Successfully.');
                    },
                        (err: HttpErrorResponse) => {
                            this.notifier.notify('error', err.error);
                        });
                }
            }
        }
    }

    CheckTime(district: any): boolean {
        if (district.StartTime > district.EndTime || district.firstHalfEndTime > district.SecondHaifStartTime ||
            district.StartTime > district.SecondHaifStartTime || district.StartTime > district.firstHalfEndTime ||
            district.EndTime < district.StartTime || district.EndTime < district.SecondHaifStartTime ||
            district.EndTime < district.firstHalfEndTime) {
            this.notifier.notify('error', 'Please enter valid time.');
            return false;
        }
        return true;
    }
}