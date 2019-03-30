import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-unavailability-component',
  templateUrl: 'unavailability.component.html'
})
export class UnAvailabilityComponent implements OnInit {
  availability: any;
  submitted = false;
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<UnAvailabilityComponent>,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.availability = data;
  }

  ngOnInit() {
    this.form = this._formBuilder.group(
      {
        availabilityId: [this.availability.availabilityId || 0],
        userId: [this.availability.userId || ''],
        availabilityStatusId: [this.availability.availabilityStatusId || 1],
        title: [this.availability.title || ''],
        startDate: [this.availability.startDate, Validators.required],
        endDate: [this.availability.endDate, Validators.required],
        startTime: [this.availability.startTime, Validators.required],
        endTime: [this.availability.endTime, Validators.required],
        isAllDayOut: [this.availability.isAllDayOut || false],
        isRepeat: [this.availability.isRepeat || false],
        repeatType: [this.availability.repeatType || ''],
        repeatValue: [this.availability.repeatValue || 0],
        repeatOnWeekDays: [this.availability.repeatOnWeekDays || ''],
        isEndsNever: [this.availability.isEndsNever || false],
        endsOnAfterNumberOfOccurrance: [this.availability.endsOnAfterNumberOfOccurrance || 0],
        endsOnUntilDate: [this.availability.endsOnUntilDate || ''],
      },
      { validator: this.checkDates }
    );

  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit(formGroup: FormGroup) {
    this.submitted = true;
    if (!formGroup.invalid) {
      this.dialogRef.close({ action: 'Submit', availability: formGroup.value });
      this.submitted = false;
    }
  }

  checkDates(group: FormGroup) {
    const startDateTime = moment(moment(group.controls.startDate.value + ' ' + group.controls.startTime.value).format('YYYY-MM-DD hh:mm a'));
    const endDateTime = moment(moment(group.controls.endDate.value + ' ' + group.controls.endTime.value).format('YYYY-MM-DD hh:mm a'));
    if (endDateTime < startDateTime) {
      return { notValid: true };
    }
    return null;
  }
}
