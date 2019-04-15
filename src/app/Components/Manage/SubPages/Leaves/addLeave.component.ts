import { Component, OnInit, ViewChild } from '@angular/core';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { FormBuilder, FormGroup, Validators , FormControl, NgForm} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AbsenceService } from '../../../../Services/absence.service';
import { UserSession } from '../../../../Services/userSession.service';
import { ActivatedRoute } from '@angular/router';
import { LeaveType } from '../../../../Model/leaveType';
import { NotifierService } from 'angular-notifier';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    templateUrl: 'addLeave.component.html'
})
export class AddLeaveComponent implements OnInit {
    private notifier: NotifierService;
    msg: string;
    leaveIdForEdit: number = 0;
    LeaveForm: FormGroup;
    constructor(private _FormBuilder: FormBuilder, private userSession : UserSession,
        private absenceService: AbsenceService, private route: ActivatedRoute,  notifier: NotifierService) { 
            this.notifier = notifier;
         }
    ngOnInit(): void {
        this.LeaveForm = this._FormBuilder.group({
            leaveTypeName: ['', Validators.required],
            // startingBalance: [''],
            isSubtractAllowance: [''],
            isApprovalRequired: [''],
            isVisible: ['']
        });

        this.editLeave();
    }

    editLeave() {
        this.route.queryParams.subscribe((params: any) => {
            if (params['Id']) {
                let leaveId = params.Id;
                this.absenceService.getById('Leave/getleaveTypeById', leaveId).subscribe((data: LeaveType) => {
                    let leaveModel = {
                        leaveTypeName: data.leaveTypeName,
                        isSubtractAllowance: data.isSubtractAllowance,
                        isApprovalRequired: data.isApprovalRequired,
                        isVisible: data.isVisible
                    }
                    this.LeaveForm.setValue(leaveModel);
                    this.leaveIdForEdit = leaveId;
                },
                    error => <any>error);
            }
        });
    }

    onSubmit(form : any) {
        if (this.LeaveForm.valid) {
            let leaveFormModel = {
                leaveTypeId: this.leaveIdForEdit,
                leaveTypeName: form.value.leaveTypeName,
                startingBalance: 2,
                isSubtractAllowance: form.value.isSubtractAllowance ? form.value.isSubtractAllowance : false,
                isApprovalRequired: form.value.isApprovalRequired ? form.value.isApprovalRequired : false,
                isVisible: form.value.isVisible ? form.value.isVisible : false,
                districtId: this.userSession.getUserDistrictId(),
                organizationId: this.userSession.getUserOrganizationId() ? this.userSession.getUserDistrictId(): '-1',
            }
            if (this.leaveIdForEdit > 0) {
                this.absenceService.insertLeaveType(leaveFormModel).subscribe((data: any) => {
                    if (this.leaveIdForEdit > 0)
                    this.notifier.notify('success', 'Updated Successfully');
                    else 
                    this.notifier.notify('success', 'Added Successfully');
                    // this.toastr.success('Added Successfully!', 'Success!');
                },
                    (err: HttpErrorResponse) => {
                    });
            }
        }
    }
}