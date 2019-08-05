import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataContext } from 'src/app/Services/dataContext.service';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.css']
})
export class CreateAnnouncementComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _dataContext: DataContext) { }

  ngOnInit() {
    this.form = this.fb.group({
      recipients: [1, Validators.required],
      title: ['', Validators.required],
      message: ['', Validators.required],
      scheduleAnnouncement: [1],
      showOn: [1],
      hideOn: [1],
      showOnDate: [''],
      showOnTime: [''],
      hideOnDate: [''],
      hideOnTime: [''],
    });
  }

  onSubmitEmployeeForm(form: any) {
    let model = {
      Recipients: form.value.recipients,
      Title: form.value.title,
      Message: form.value.message,
      ScheduleAnnouncement: form.value.scheduleAnnouncement,
      ShowOn: form.value.showOn,
      HideOn: form.value.hideOn,
      ShowOnDate: form.value.showOnDate,
      ShowOnTime: form.value.showOnTime,
      HideOnDate: form.value.hideOnDate,
      HideOnTime: form.value.hideOnTime,
    }
    this._dataContext.post('announcement/insertAnnouncement', model).subscribe((data: any) => {

    },
      error => <any>error);
  }

  onSubmit(from: any) {
  }

  onClose() {
  }
}
