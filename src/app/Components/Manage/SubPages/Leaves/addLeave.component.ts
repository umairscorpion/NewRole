import { Component, OnInit } from '@angular/core';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AbsenceService } from '../../../../Services/absence.service';
import { UserSession } from '../../../../Services/userSession.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveType } from '../../../../Model/leaveType';
import { NotifierService } from 'angular-notifier';
import { Allowance } from '../../../../Model/Manage/allowance.detail';

@Component({
    templateUrl: 'addLeave.component.html'
})
export class AddLeaveComponent implements OnInit {
    private notifier: NotifierService;
    msg: string;
    allowances: Allowance[];
    leaveIdForEdit: number = 0;
    LeaveForm: FormGroup;

    constructor(
        private router: Router,
        private _FormBuilder: FormBuilder,
        private userSession: UserSession,
        private districtService: DistrictService,
        private absenceService: AbsenceService,
        private route: ActivatedRoute,
        notifier: NotifierService) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.LeaveForm = this._FormBuilder.group({
            leaveTypeName: ['', Validators.required],
            allowanceType: [''],
            isSubtractAllowance: [''],
            isApprovalRequired: [''],
            isVisible: ['']
        });
        this.getAllowances();
        this.editLeave();
    }

    editLeave() {
        this.route.queryParams.subscribe((params: any) => {
            if (params['Id']) {
                let leaveId = params.Id;
                this.absenceService.getById('Leave/getleaveTypeById', leaveId).subscribe((data: LeaveType) => {
                    this.LeaveForm.patchValue({ ...data });
                    this.leaveIdForEdit = leaveId;
                },
                    error => <any>error);
            }
        });
    }

    getAllowances() {
        this.districtService.getById('District/getAllowances', this.userSession.getUserDistrictId()).subscribe((allowances: Allowance[]) => {
            this.allowances = allowances;
        },
            (err: HttpErrorResponse) => {
            });
    }

    onSubmit(form: any) {
        if (this.LeaveForm.valid) {
            let leaveFormModel = {
                leaveTypeId: this.leaveIdForEdit,
                leaveTypeName: form.value.leaveTypeName,
                startingBalance: 2,
                isSubtractAllowance: form.value.isSubtractAllowance ? form.value.isSubtractAllowance : false,
                isApprovalRequired: form.value.isApprovalRequired ? form.value.isApprovalRequired : false,
                isVisible: form.value.isVisible ? form.value.isVisible : false,
                districtId: this.userSession.getUserDistrictId(),
                organizationId: this.userSession.getUserOrganizationId() ? this.userSession.getUserDistrictId() : '-1',
                allowanceType: form.value.allowanceType
            }
            this.absenceService.insertLeaveType(leaveFormModel).subscribe((data: any) => {
                if (this.leaveIdForEdit > 0) {
                    this.notifier.notify('success', 'Updated Successfully');
                    this.router.navigate(['/manage/leave']);
                }
                else {
                    this.notifier.notify('success', 'Added Successfully');
                    this.router.navigate(['/manage/leave']);
                }
            },
                (err: HttpErrorResponse) => {
                });
        }
    }
}