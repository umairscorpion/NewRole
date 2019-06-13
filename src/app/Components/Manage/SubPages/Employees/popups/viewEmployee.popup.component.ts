import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';
import { EmployeesComponent } from '../employees.component';

@Component({
  templateUrl: 'viewEmployee.html',
  styleUrls: ['employee-detail.popup.component.scss']
})
export class PopupDialogForEmployeeDetail {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<EmployeesComponent>) {}

  getImage(imageName: string) {
    if (imageName && imageName.length > 0) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(environment.profileImageUrl + imageName);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}