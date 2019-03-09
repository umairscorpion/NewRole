import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { ReportDetail } from 'src/app/Model/Report/report.detail';

@Component({
  selector: 'report-details',
  templateUrl: 'report-details.popup.component.html',
  styleUrls: ['report-details.popup.component.scss']
})
export class ReportDetailsComponent implements OnInit {
  reportDetail: ReportDetail = new ReportDetail();
  constructor(
    private dialogRef: MatDialogRef<ReportDetailsComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reportDetail = data;
  }

  ngOnInit() {
  }


  onClose() {
    this.dialogRef.close();
  }

  // onPrint() {
  //   this.dialogRef.close({ action: 'Print', appointment: this.appointment });
  // }

  // onEdit() {
  //   const dialogRef = this.dialog.open(AppointmentEditComponent, {
  //     panelClass: 'appointment-edit-dialog',
  //     data: this.appointment
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.dialogRef.close(result);
  //     }
  //   });
  // }

  // onDelete() {
  //   this.dialogRef.close({ action: 'Delete', appointment: this.appointment });
  // }

  // onMail() {
  //   this.dialogRef.close({ action: 'Mail', appointment: this.appointment });
  // }

  // onCheckIn() {
  //   this.dialogRef.close({ action: 'CheckIn', appointment: this.appointment });
  // }

  // onCompleted() {
  //   this.dialogRef.close({
  //     action: 'Completed',
  //     appointment: this.appointment
  //   });
  // }

  // onInvoice() {
  //   this.dialogRef.close({ action: 'Invoice', appointment: this.appointment });
  // }

}
