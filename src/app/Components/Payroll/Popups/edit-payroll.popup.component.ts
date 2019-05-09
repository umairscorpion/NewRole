import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DistrictService } from '../../../Service/Manage/district.service';
import { UserSession } from '../../../Services/userSession.service';
import { ReportDetail } from '../../../Model/Report/report.detail';
import { NotifierService } from 'angular-notifier';
import { AbsenceService } from '../../../Services/absence.service';

@Component({
    selector: 'edit-payroll',
    templateUrl: 'edit-payroll.popup.component.html',
    styleUrls: ['edit-payroll.popup.component.scss']
})
export class EditPayrollComponent implements OnInit {
    private notifier: NotifierService;
    msg: string;
    constructor(private dialogRef: MatDialogRef<EditPayrollComponent>, private fb: FormBuilder, private absenceService: AbsenceService,
        @Inject(MAT_DIALOG_DATA) public reportDetail: ReportDetail, notifier: NotifierService,
        private districtService: DistrictService, private userSession: UserSession) {
        this.notifier = notifier;
    }

    onCloseDialog() {
        this.dialogRef.close();
    }

    ngOnInit() {
    }

    submitAllowance(allowance: FormGroup) {
        if (allowance.valid) {
            allowance.value.expirationStartDate = new Date(allowance.value.expirationStartDate).toLocaleDateString();
            allowance.value.expirationEndDate = new Date(allowance.value.expirationEndDate).toLocaleDateString();
            if (allowance.value.id > 0) {
                this.districtService.Patch('District/allowances/', allowance.value).subscribe((data: any) => {
                    this.dialogRef.close();
                },
                    error => this.msg = <any>error);
            }
            else {
                this.districtService.post('District/allowances/', allowance.value).subscribe((data: any) => {
                    this.dialogRef.close();
                },
                    error => this.msg = <any>error);
            }
        }
    }

    onUpdateAbsence(reportDetail: ReportDetail) {
        let AbsenceModel = {
            EmployeeId: reportDetail.employeeId,
            absenceId: reportDetail.absenceId,
            startDate: new Date(reportDetail.startDate as string).toLocaleDateString(),
            endDate: new Date(reportDetail.endDate as string).toLocaleDateString(),
            startTime: reportDetail.startTime,
            endTime: reportDetail.endTime,
            absenceReasonId: reportDetail.reasonId,
            durationType: reportDetail.durationType,
            status: reportDetail.statusId,
            substituteRequired: reportDetail.substituteRequired,
            absenceScope: reportDetail.absenceScope,
            substituteNotes: reportDetail.notes,
            anyAttachment: reportDetail.anyAttachment,
            substituteId: reportDetail.substituteId
        }
        this.absenceService.Patch('/Absence/updateAbsence/', AbsenceModel).subscribe((respose: any) => {
            if (respose == "success") {
                this.dialogRef.close('Reload');
                this.notifier.notify('success', 'Updated Successfully');
            }
            else {
                this.notifier.notify('error', 'Absence overlapping please select different date or time.');
            }
        });
    }
}