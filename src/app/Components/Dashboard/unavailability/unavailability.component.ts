import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { RecurringComponent } from './recurring/recurring.component';
import swal from 'sweetalert2';
import { AvailabilityService } from 'src/app/Services/availability.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-unavailability-component',
  templateUrl: 'unavailability.component.html'
})
export class UnAvailabilityComponent implements OnInit {
  availability: any;
  submitted = false;
  form: FormGroup;
  time = false;
  times = [];
  endTimes = [];
  startTimeMinutes = 0;
  endTimeMinutes = 0;
  doOpen = true;

  constructor(
    private dialogRef: MatDialogRef<UnAvailabilityComponent>,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private availabilityService: AvailabilityService,
    private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
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
        isAllDayOut: [this.availability.availabilityId ? this.availability.isAllDayOut : true],
        isRepeat: [this.availability.isRepeat || false],
        repeatType: [this.availability.repeatType || 'week'],
        repeatValue: [this.availability.repeatValue || 0],
        repeatOnWeekDays: [this.availability.repeatOnWeekDay || [new Date().getDay().toString()], Validators.required],
        endsOnAfterNumberOfOccurrance: [this.availability.endsOnAfterNumberOfOccurrance || 0],
        endsOnUntilDate: [this.availability.endsOnUntilDate || new Date()],
        endsOnStatusId: [this.availability.isEndsOnDate ? 1 : this.availability.isEndsOnAfterNumberOfOccurrance ? 2 : 1],
        isEndsOnDate: [this.availability.isEndsOnDate || false],
        isEndsOnAfterNumberOfOccurrance: [this.availability.isEndsOnAfterNumberOfOccurrance || false],
      },
      { validator: this.checkDates }
    );
    this.times = this.timelineLabels(
      this.availability.startTime,
      30,
      'minutes',
      false
    );
    this.endTimes = this.timelineLabels(
      this.availability.endTime,
      30,
      'minutes',
      true
    );
    this.SetTime(this.availability.availabilityId ? this.availability.isAllDayOut : true);
  }

  recurrence() {
    if (this.doOpen) {
      this.doOpen = false;
      this.dialog.openDialogs.pop();
      this.form.get('isRepeat').setValue(true);
      const dialogRef = this.dialog.open(
        RecurringComponent,
        {
          panelClass: 'availability-recurrence-dialog',
          data: this.form.value
        }
      );
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.form.patchValue({ ...result.availability });
        }
      });
      this.doOpen = true;
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit(formGroup: FormGroup) {
    this.submitted = true;
    if (!formGroup.invalid) {
      if (this.availability.availabilityId > 0) {
        let startDate = moment(new Date(formGroup.value.startDate).toLocaleDateString()).format('YYYY-MM-DD');
        let endDate = moment(new Date(formGroup.value.endDate).toLocaleDateString()).format('YYYY-MM-DD');
        let endsOnUntilDate = moment(new Date(formGroup.value.endsOnUntilDate).toLocaleDateString()).format('YYYY-MM-DD');
        let endDateAfterNumberOfOccurrances = moment().add(formGroup.value.endsOnAfterNumberOfOccurrance, 'weeks').format('YYYY-MM-DD');
        let model = {
          startDate,
          endDate,
          endsOnUntilDate,
          endDateAfterNumberOfOccurrances
        }
        this.availabilityService.update(this.availability.availabilityId, model, formGroup.getRawValue()).subscribe((data: any) => {
          if (data == 'accepted') {
            this.notifier.notify('error', 'You can not set unavailability for the date you are booked !');
            this.SetDateTimeErrors();
            return false;
          }
          else if (data == 'unavailable') {
            this.notifier.notify('error', 'Status set to unavailable. Please select different date and time.');
            this.SetDateTimeErrors();
            return false;
          }
          else if (data == 'overlap') {
            this.notifier.notify('error', 'Status set to unavailable. Please select different date and time.');
            this.SetDateTimeErrors();
            return false;
          }
          else {
            this.notifier.notify('success', 'Updated Successfully');
            this.dialogRef.close({ action: 'Submit' });
            this.submitted = false;
          }
        });
      }
      else {
        let startDate = moment(new Date(formGroup.value.startDate).toLocaleDateString()).format('YYYY-MM-DD');
        let endDate = moment(new Date(formGroup.value.endDate).toLocaleDateString()).format('YYYY-MM-DD');
        let endsOnUntilDate = moment(new Date(formGroup.value.endsOnUntilDate).toLocaleDateString()).format('YYYY-MM-DD');
        let endDateAfterNumberOfOccurrances = moment(new Date(formGroup.value.startDate).toLocaleDateString()).add(formGroup.value.endsOnAfterNumberOfOccurrance, 'weeks').format('YYYY-MM-DD');
        let model = {
          startDate,
          endDate,
          endsOnUntilDate,
          endDateAfterNumberOfOccurrances
        }
        this.availabilityService.create(model, formGroup.getRawValue()).subscribe((data: any) => {
          if (data == 'accepted') {
            this.notifier.notify('error', 'You can not set unavailability for the date you are booked !');
            this.SetDateTimeErrors();
            return false;
          }
          else if (data == 'unavailable') {
            this.notifier.notify('error', 'Status set to unavailable. Please select different date and time.');
            this.SetDateTimeErrors();
            return false;
          }
          else if (data == 'overlap') {
            this.notifier.notify('error', 'Status set to unavailable. Please select different date and time.');
            this.SetDateTimeErrors();
            return false;
          }
          else {
            this.notifier.notify('success', 'Added Successfully');
            this.dialogRef.close({ action: 'Submit' });
            this.submitted = false;
          }
        });
      }
    }
  }

  delete() {
    swal.fire({
      title: 'Delete',
      text:
        'Are you sure, you want to delete?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-danger',
      cancelButtonClass: 'btn btn-success',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then(r => {
      if (r.value) {
        this.dialogRef.close({ action: 'Delete', id: this.availability.availabilityId });
      }
    });
  }

  checkDates(group: FormGroup) {
    const startDateTime = moment(moment(group.controls.startDate.value + ' ' + group.controls.startTime.value).format('YYYY-MM-DD hh:mm a'));
    const endDateTime = moment(moment(group.controls.endDate.value + ' ' + group.controls.endTime.value).format('YYYY-MM-DD hh:mm a'));
    if (endDateTime < startDateTime) {
      return { notValid: true };
    }
    return null;
  }

  timelineLabels(desiredStartTime, interval, period, isEndTime) {
    const periodsInADay = moment.duration(1, 'day').as(period);
    const timeLabels = [];
    const startTimeMoment = moment(desiredStartTime, 'hh:mm a');
    const selectedStartTime = moment(
      moment(
        this.form.get('startDate').value +
        ' ' +
        this.form.get('startTime').value
      ).format('YYYY-MM-DD hh:mm a')
    );
    let duration: moment.Duration;
    for (let i = 0; i <= periodsInADay; i += interval) {
      startTimeMoment.add(i === 0 ? 0 : interval, period);
      if (
        isEndTime &&
        this.form.get('startDate').value ===
        this.form.get('endDate').value
      ) {
        duration = moment.duration(
          moment(
            moment(
              moment(
                this.form.get('startDate').value +
                ' ' +
                startTimeMoment.format('hh:mm a')
              ).format('YYYY-MM-DD hh:mm a')
            )
          ).diff(selectedStartTime)
        );
        timeLabels.push(startTimeMoment.format('hh:mm a'));
      } else {
        timeLabels.push(startTimeMoment.format('hh:mm a'));
      }
    }
    if (isEndTime) {
      this.form.get('endTime').setValue(timeLabels[0]);
    }
    return timeLabels;
  }

  pad(value) {
    if (value < 10) {
      return '0' + value;
    } else {
      return value;
    }
  }

  timeChanged(entity) {
    if (entity) {
      if (entity === 'startTime') {
        const startTime = this.form.get('startTime').value;
        this.startTimeMinutes = parseInt(startTime.substring(3, 5));
        this.endTimes = this.timelineLabels(
          startTime.substring(0, 8),
          30,
          'minutes',
          true
        );
      } else {
        this.endTimeMinutes = parseInt(
          this.form.get(entity).value.substring(3, 5)
        );
      }
    }
  }

  //For Selecting End Date Automatically
  SetEndDateValue(startDate: Date, endDate: Date) {
    this.form.get('endDate').setValue(startDate);
  }

  SetTime(result: boolean) {
    if (result) {
      this.form.controls['startTime'].setValue('12:00 AM');
      this.form.controls['endTime'].setValue('12:00 AM');
      this.form.controls['startTime'].disable();
      this.form.controls['endTime'].disable();
    }
    else {
      this.form.controls['startTime'].enable();
      this.form.controls['endTime'].enable();
    }
  }

  OnchangeAvailabilityStatus(value: any) {
    if (value == 1 || value == 2) {
      this.form.controls['isEndsOnDate'].setValue(false);
      this.form.controls['isEndsOnAfterNumberOfOccurrance'].setValue(false);
    }
  }

  SetDateTimeErrors() {
    this.form.controls['startDate'].setErrors({ 'incorrect': true });
    this.form.controls['endDate'].setErrors({ 'incorrect': true });
    this.form.controls['startTime'].setErrors({ 'incorrect': true });
    this.form.controls['endTime'].setErrors({ 'incorrect': true });
  }
}
