import { Component, OnInit, ViewChild } from '@angular/core';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { FormBuilder, FormGroup, Validators , FormControl, NgForm} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    templateUrl: 'addLeave.component.html'
})
export class AddLeaveComponent implements OnInit {
    msg: string;
    LeaveForm: FormGroup;
    constructor(private _FormBuilder: FormBuilder , private _districtService: DistrictService) { }
    ngOnInit(): void {
        this.LeaveForm = this._FormBuilder.group({
            LeaveTypeName: ['', Validators.required],
            StartingBalance: ['', Validators.required]
        });
    }
    onSubmit(form : any) {
        if (this.LeaveForm.valid) {
            let leaveFormModel = {
                LeaveTypeName: form.value.LeaveTypeName,
                StartingBalance: form.value.StartingBalance
            }
            this._districtService.post('Leave/insertLeaveType', leaveFormModel).subscribe((data: any) => {
                // this.toastr.success('Added Successfully!', 'Success!');
            },
                (err: HttpErrorResponse) => {
                    // this.toastr.error(err.error.error_description, 'Oops!');
                });
        }
    }
}