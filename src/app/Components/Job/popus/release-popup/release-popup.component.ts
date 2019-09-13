import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-release-popup',
  templateUrl: './release-popup.component.html',
  styleUrls: ['./release-popup.component.scss']
})
export class ReleasePopupComponent implements OnInit {

  releaseAbsenceForm: FormGroup;

  constructor(
    private _dialogRef: MatDialogRef<ReleasePopupComponent>,
    private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.releaseAbsenceForm = this._formBuilder.group({
      reasonId: [5, Validators.required],
      reasonText: [{ value: '', disabled: true }, Validators.required]
    });
  }

  onChangeReason(reason: any): void {
    if (reason == 5 || reason == 6) {
      this.releaseAbsenceForm.controls['reasonText'].setValue('');
      this.releaseAbsenceForm.controls['reasonText'].disable();
    }
    else {
      this.releaseAbsenceForm.controls['reasonText'].enable();
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
