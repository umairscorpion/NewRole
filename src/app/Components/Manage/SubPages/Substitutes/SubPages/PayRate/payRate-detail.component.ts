import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DistrictService } from '../../../../../../Service/Manage/district.service';
import { UserSession } from '../../../../../../Services/userSession.service';
import { PayRateSettings } from '../../../../../../Model/payRateSettings';

@Component({
    selector: 'payRate-details',
    templateUrl: 'payRate-detail.component.html',
    styleUrls: ['payRate-detail.component.scss']
})
export class PayRateComponent implements OnInit {
    payRates: PayRateSettings[] = Array<PayRateSettings>();
    position: FormGroup;
    msg: string;
    constructor( private fb: FormBuilder, private districtService: DistrictService,
         private userSession: UserSession) {
    }

    ngOnInit() {
        for (let i = 0; i <= 1; i++) {
            this.payRates.push(new PayRateSettings());
        }
    }

    addNewPayRate() {
        this.payRates.push(new PayRateSettings());
    }

    onSubmitPosition(position: FormGroup) {
        if(position.valid) {
            if (position.value.id > 0) {
                position.value.districtId = this.userSession.getUserDistrictId();
                this.districtService.Patch('user/positions/', position.value).subscribe((data: any) => {
                },
                    error => this.msg = <any>error);
            }
            else {
                this.districtService.post('user/positions/', position.value).subscribe((data: any) => {
                },
                    error => this.msg = <any>error);
            }
        }
    }

}