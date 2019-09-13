import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cancel-popup',
  templateUrl: './cancel-popup.component.html',
  styleUrls: ['./cancel-popup.component.scss']
})
export class CancelPopupComponent implements OnInit {

  cancelAbsenceForm: FormGroup;

  constructor(
    private _dialogRef: MatDialogRef<CancelPopupComponent>,
    private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.cancelAbsenceForm = this._formBuilder.group({
      reasonId: [1, Validators.required],
      reasonText: [{ value: '', disabled: true }, Validators.required]
    });
  }

  onChangeReason(reason: any): void {
    if (reason == 1 || reason == 2 || reason == 3) {
      this.cancelAbsenceForm.controls['reasonText'].setValue('');
      this.cancelAbsenceForm.controls['reasonText'].disable();
    }
    else {
      this.cancelAbsenceForm.controls['reasonText'].enable();
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
