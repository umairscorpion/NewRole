import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DistrictService } from '../../../../../../Service/Manage/district.service';
import { UserSession } from '../../../../../../Services/userSession.service';
import { PayRateSettings } from '../../../../../../Model/payRateSettings';
import { PayRateRule } from '../../../../../../Model/payRateRule';

@Component({
    selector: 'payRate-details',
    templateUrl: 'payRate-detail.component.html',
    styleUrls: ['payRate-detail.component.scss']
})
export class PayRateComponent implements OnInit {
    payRates: PayRateSettings[] = Array<PayRateSettings>();
    payRateRules: PayRateRule[] = Array<PayRateRule>();
    position: FormGroup;
    msg: string;
    positions: PayRateSettings[];
    constructor(private fb: FormBuilder, private districtService: DistrictService,
        private userSession: UserSession) {
    }

    ngOnInit() {
        this.getpositions();
        for (let i = 0; i < 1; i++) {
            this.payRates.push(new PayRateSettings());
        }
        for (let i = 0; i < 3; i++) {
            this.payRateRules.push(new PayRateRule());
        }
    }

    addNewPayRate() {
        this.payRates.push(new PayRateSettings());
    }

    addNewPayRateRule() {
        this.payRateRules.push(new PayRateRule());
    }

    getpositions(): void {
        let DistrictId = this.userSession.getUserDistrictId();
        this.districtService.getById('user/positions', DistrictId).subscribe((data: any) => {
            this.positions = data;
        },
            error => this.msg = <any>error);
    }

    postPayRate(payRate: any) {
        payRate.districtId = this.userSession.getUserDistrictId();
        if (payRate.id > 0) {
            this.districtService.Patch('user/payRate/', payRate).subscribe((data: any) => {
            },
                error => this.msg = <any>error);
        }
        else {
            this.districtService.post('user/payRate/', payRate).subscribe((data: any) => {
            },
                error => this.msg = <any>error);
        }
    }

    postPayRateRule(payRateRule: any) {
        payRateRule.districtId = this.userSession.getUserDistrictId();
        if (payRateRule.id > 0) {
            this.districtService.Patch('user/payRateRule/', payRateRule).subscribe((data: any) => {
            },
                error => this.msg = <any>error);
        }
        else {
            this.districtService.post('user/payRateRule/', payRateRule).subscribe((data: any) => {
            },
                error => this.msg = <any>error);
        }
    }

    onSubmitPosition(position: FormGroup) {
        if (position.valid) {
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