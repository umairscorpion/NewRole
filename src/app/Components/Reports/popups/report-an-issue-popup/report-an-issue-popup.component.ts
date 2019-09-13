import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-report-an-issue-popup',
  templateUrl: './report-an-issue-popup.component.html',
  styleUrls: ['./report-an-issue-popup.component.scss']
})
export class ReportAnIssuePopupComponent implements OnInit {

  reportIssueForm: FormGroup;

  constructor(
    private _dialogRef: MatDialogRef<ReportAnIssuePopupComponent>,
    private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.reportIssueForm = this._formBuilder.group({
      reasonId: [5, Validators.required],
      reasonText: [{ value: '', disabled: true }, Validators.required]
    });
  }

  // onChangeReason(reason: any): void {
  //   if (reason == 1 || reason == 2) {
  //     this.reportIssueForm.controls['reasonText'].setValue('');
  //     this.reportIssueForm.controls['reasonText'].disable();
  //   }
  //   else {
  //     this.reportIssueForm.controls['reasonText'].enable();
  //   }
  // }

  // onCloseDialog() {
  //   this._dialogRef.close();
  // }

  // onSubmit(formGroup: FormGroup) {
  //   if (!formGroup.invalid) {
  //     this._dialogRef.close(formGroup.getRawValue());
  //   }
  // }

}
