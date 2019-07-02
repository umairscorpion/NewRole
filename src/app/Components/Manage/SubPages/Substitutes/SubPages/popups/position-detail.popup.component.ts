import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DistrictService } from '../../../../../../Service/Manage/district.service';
import { UserSession } from '../../../../../../Services/userSession.service';

@Component({
    selector: 'position-details',
    templateUrl: 'position-detail.popup.component.html',
    styleUrls: ['position-detail.popup.component.scss']
})
export class PositionComponent implements OnInit {
    position: FormGroup;
    msg: string;

    constructor(
        private dialogRef: MatDialogRef<PositionComponent>, 
        private fb: FormBuilder, 
        @Inject(MAT_DIALOG_DATA) public data: any,
        private districtService: DistrictService, 
        private userSession: UserSession) {
    }
    
    onCloseDialog() {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.position = this.fb.group({
            id:[0],
            title: ['', Validators.required],
            isVisible: [false],
            districtId:[this.userSession.getUserDistrictId()]
        });
        if (this.data) {
            this.position.patchValue({...this.data});
        }
    }

    onSubmitPosition(position: FormGroup) {
        if(position.valid) {
            if (position.value.id > 0) {
                position.value.districtId = this.userSession.getUserDistrictId();
                this.districtService.Patch('user/positions/', position.value).subscribe((data: any) => {
                    this.dialogRef.close();
                },
                    error => this.msg = <any>error);
            }
            else {
                this.districtService.post('user/positions/', position.value).subscribe((data: any) => {
                    this.dialogRef.close();
                },
                    error => this.msg = <any>error);
            }
        }
    }
}