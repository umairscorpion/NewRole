import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
        // startTime: [this.availability.startTime, Validators.required],
        // endTime: [this.availability.endTime, Validators.required],
        isAllDayOut: [this.availability.isAllDayOut || false],
        isRepeat: [this.availability.isRepeat || true],
        repeatType: [this.availability.repeatType || 'week'],
        repeatValue: [this.availability.repeatValue || 1],
        repeatOnWeekDays: [this.availability.repeatOnWeekDays || ''],
        isEndsNever: [this.availability.isEndsNever || false],
        endsOnAfterNumberOfOccurrance: [this.availability.endsOnAfterNumberOfOccurrance || 10],
        endsOnUntilDate: [this.availability.endsOnUntilDate || new Date()],
      }
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
}
