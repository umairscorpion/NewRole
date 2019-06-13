import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css']
})
export class EventAddComponent implements OnInit {
  event: any;
  submitted = false;
  form: FormGroup;
  time = false;
  times = [];
  endTimes = [];
  startTimeMinutes = 0;
  endTimeMinutes = 0;
  doOpen = true;
  constructor(
    private dialogRef: MatDialogRef<EventAddComponent>,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.event = data;
  }

  ngOnInit() {
    this.form = this._formBuilder.group(
      {
        eventId: [this.event.eventId || 0],
        userId: [this.event.userId || ''],
        title: [this.event.title || ''],
        startDate: [this.event.startDate, Validators.required],
        endDate: [this.event.endDate, Validators.required],
        startTime: [this.event.startTime, Validators.required],
        endTime: [this.event.endTime, Validators.required],
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit(formGroup: FormGroup) {
    this.submitted = true;
    if (!formGroup.invalid) {
      this.dialogRef.close({ action: 'Submit', id: this.event.eventId, event: formGroup.value });
      this.submitted = false;
    }
  }
}
