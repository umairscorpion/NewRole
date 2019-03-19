import { Component, OnInit, ViewChild } from '@angular/core';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { FormBuilder, FormGroup, Validators , FormControl, NgForm} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AbsenceService } from '../../../../Services/absence.service';
import { UserSession } from '../../../../Services/userSession.service';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    templateUrl: 'addLeave.component.html'
})
export class AddLeaveComponent implements OnInit {
    msg: string;
    LeaveForm: FormGroup;
    constructor(private _FormBuilder: FormBuilder, private userSession : UserSession,
        private absenceService: AbsenceService) { }
    ngOnInit(): void {
        this.LeaveForm = this._FormBuilder.group({
            leaveTypeName: ['', Validators.required],
            // startingBalance: [''],
            isSubtractAllowance: [''],
            isApprovalRequired: [''],
            isVisible: ['']
        });
    }

    onSubmit(form : any) {
        if (this.LeaveForm.valid) {
            let leaveFormModel = {
                leaveTypeId: 0,
                leaveTypeName: form.value.leaveTypeName,
                startingBalance: 2,
                isSubtractAllowance: form.value.isSubtractAllowance ? form.value.isSubtractAllowance : false,
                isApprovalRequired: form.value.isApprovalRequired ? form.value.isApprovalRequired : false,
                isVisible: form.value.isVisible ? form.value.isVisible : false,
                districtId: this.userSession.getUserDistrictId(),
                organizationId: this.userSession.getUserOrganizationId() ? this.userSession.getUserDistrictId(): '-1',
            }

            this.absenceService.insertLeaveType(leaveFormModel).subscribe((data: any) => {
                // this.toastr.success('Added Successfully!', 'Success!');
            },
                (err: HttpErrorResponse) => {
                    // this.toastr.error(err.error.error_description, 'Oops!');
                });
        }
    }
}