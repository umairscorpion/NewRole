import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-recurring-component',
  templateUrl: 'recurring.component.html'
})
export class RecurringComponent implements OnInit {
  availability: any;
  submitted = false;
  form: FormGroup;
  endsOn = 'on';

  constructor(
    private dialogRef: MatDialogRef<RecurringComponent>,
    private _formBuilder: FormBuilder,
    private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.availability = data;
  }

  ngOnInit() {
    this.form = this._formBuilder.group(
      {
        availabilityId: [this.availability.availabilityId || 0],
        userId: [this.availability.userId || ''],
        availabilityStatusId: [this.availability.availabilityStatusId || 3],
        title: [this.availability.title || ''],
        startDate: [this.availability.startDate, Validators.required],
        endDate: [this.availability.endDate, Validators.required],
        isAllDayOut: [this.availability.isAllDayOut || false],
        isRepeat: [this.availability.isRepeat || true],
        repeatType: [this.availability.repeatType || 'week'],
        repeatValue: [this.availability.repeatValue || 1],
        repeatOnWeekDays: [this.availability.repeatOnWeekDays, Validators.required],
        endsOnAfterNumberOfOccurrance: [this.availability.endsOnAfterNumberOfOccurrance || 10],
        endsOnUntilDate: [this.availability.endsOnUntilDate || new Date()],
        endsOnStatusId: [this.availability.isEndsOnDate ? 1 : this.availability.isEndsOnAfterNumberOfOccurrance ? 2 : 1],
        isEndsOnDate: [this.availability.isEndsOnDate || true],
        isEndsOnAfterNumberOfOccurrance: [this.availability.isEndsOnAfterNumberOfOccurrance || false],
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit(formGroup: FormGroup) {
    this.submitted = true;
    if (formGroup.value.repeatOnWeekDays.length <= 0) {
      this.notifier.notify('error', 'Please select repeat on day.');
    }
    if (!formGroup.invalid) {
      formGroup.value.availabilityStatusId = this.form.controls['availabilityStatusId'].setValue(3);
      this.dialogRef.close({ action: 'Submit', availability: formGroup.value });
      this.submitted = false;
    }
  }

  Onchange(value: any) {
    if (value == "on") {
      this.form.controls['isEndsOnDate'].setValue(true);
      this.form.controls['isEndsOnAfterNumberOfOccurrance'].setValue(false);
    }
    else {
      this.form.controls['isEndsOnDate'].setValue(false);
      this.form.controls['isEndsOnAfterNumberOfOccurrance'].setValue(true);
    }
  }
}
