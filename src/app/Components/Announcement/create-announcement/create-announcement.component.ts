import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataContext } from 'src/app/Services/dataContext.service';
import { NotifierService } from 'angular-notifier';
import { moment } from 'fullcalendar';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.css']
})
export class CreateAnnouncementComponent implements OnInit {

  form: FormGroup;
  Districts: any;
  Organizations: any;
  DistrictId: any;

  constructor(
    private fb: FormBuilder,
    private _dataContext: DataContext,
    private notifier: NotifierService, ) { }

  ngOnInit() {
    this.form = this.fb.group({
      recipients: [1, Validators.required],
      districtId: [0, Validators.required],
      organizationId: [''],
      title: ['', Validators.required],
      message: ['', Validators.required],
      scheduleAnnouncement: [{ value: 1, disabled: true }],
      showOn: [{ value: 1, disabled: true }],
      hideOn: [{ value: 1, disabled: true }],
      showOnDate: ['', Validators.required],
      showOnTime: ['', Validators.required],
      hideOnDate: ['', Validators.required],
      hideOnTime: ['', Validators.required],
    });

    this.GetDistricts();
  }

  onSubmit(form: any) {
    if (!form.invalid) {
      let model = {
        Recipients: form.value.recipients,
        DistrictId: form.value.districtId,
        OrganizationId: form.value.organizationId,
        Title: form.value.title,
        Message: form.value.message,
        ScheduleAnnouncement: 1,
        ShowOn: 1,
        HideOn: 1,
        ShowOnDate: moment(new Date(form.value.showOnDate).toLocaleDateString()).format('YYYY-MM-DD'),
        ShowOnTime: form.value.showOnTime,
        HideOnDate: moment(new Date(form.value.hideOnDate).toLocaleDateString()).format('YYYY-MM-DD'),
        HideOnTime: form.value.hideOnTime,
      }
      this._dataContext.post('announcement/insertAnnouncement', model).subscribe((data: any) => {
        this.notifier.notify('success', 'Saved Successfully.');
        this.OnCancel();
      },
        error => <any>error);
    }
  }

  GetDistricts(): void {
    this._dataContext.get('district/getDistricts').subscribe((data: any) => {
      this.Districts = data;
    },
      error => <any>error);
  }

  GetOrganizationsByDistrictId(districtid: any) {
    this.DistrictId = districtid;
    this._dataContext.getById('School/getOrganizationsByDistrictId', this.DistrictId).subscribe((data) => {
      this.Organizations = data;
    });
  }

  OnCancel() {
    this.form.controls['recipients'].setValue(1);
    this.form.controls['districtId'].setValue(0);
    this.form.controls['organizationId'].setValue('');
    this.form.controls['title'].setValue('');
    this.form.controls['message'].setValue('');
    this.form.controls['scheduleAnnouncement'].setValue(1);
    this.form.controls['showOn'].setValue(1);
    this.form.controls['hideOn'].setValue(1);
    this.form.controls['showOnDate'].setValue('');
    this.form.controls['showOnTime'].setValue('');
    this.form.controls['hideOnDate'].setValue('');
    this.form.controls['hideOnTime'].setValue('');
  }

  //For Selecting End Date Automatically
  SetEndDateValue(ShowOnDate: Date, HideOnDate: Date) {
    if (HideOnDate.toString() == "") {
      this.form.get('hideOnDate').setValue(ShowOnDate);
    }
  }
}
