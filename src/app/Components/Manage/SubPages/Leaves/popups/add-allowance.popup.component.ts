import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '../../../../../../../node_modules/@angular/forms';
import { DistrictService } from '../../../../../Service/Manage/district.service';
import { UserSession } from '../../../../../Services/userSession.service';

@Component({
    selector: 'allowance-details',
    templateUrl: 'add-allowance.popup.component.html',
    styleUrls: ['add-allowance.popup.component.scss']
})
export class AllowanceComponent implements OnInit {
    allowance: FormGroup;
    msg: string;
    constructor(private dialogRef: MatDialogRef<AllowanceComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
        private districtService: DistrictService, private userSession: UserSession) {
    }
    
    onCloseDialog() {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.allowance = this.fb.group({
            id:[0],
            districtId: [this.userSession.getUserDistrictId()],
            title: ['', Validators.required],
            yearlyAllowance: ['', Validators.required],
            isDeductAllowance: [false],
            isResidualDays: [false],
            isEnalbled: [false]
        });
        if (this.data) {
            this.allowance.patchValue({...this.data});
        }
    }

    submitAllowance(allowance: FormGroup) {
        if(allowance.valid) {
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

}