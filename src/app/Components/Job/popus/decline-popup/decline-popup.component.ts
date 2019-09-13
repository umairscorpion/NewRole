import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-decline-popup',
  templateUrl: './decline-popup.component.html',
  styleUrls: ['./decline-popup.component.scss']
})
export class DeclinePopupComponent implements OnInit {

  declineAbsenceForm: FormGroup;
  
  constructor(
    private _dialogRef: MatDialogRef<DeclinePopupComponent>,
    private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.declineAbsenceForm = this._formBuilder.group({
      reasonId: [7, Validators.required],
      reasonText: [{ value: '', disabled: true }, Validators.required]
    });
  }

  onChangeReason(reason: any): void {
    if (reason == 7 || reason == 8) {
      this.declineAbsenceForm.controls['reasonText'].setValue('');
      this.declineAbsenceForm.controls['reasonText'].disable();
    }
    else {
      this.declineAbsenceForm.controls['reasonText'].enable();
    }
  }

  onCloseDialog() {
    this._dialogRef.close();
  }

  onSubmit(formGroup: FormGroup) {
    if (!formGroup.invalid) {
      this._dialogRef.close(formGroup.getRawValue());
    }
  }
}
