import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DistrictService } from '../../../../../../Service/Manage/district.service';
import { UserSession } from '../../../../../../Services/userSession.service';
import { PayRateSettings } from '../../../../../../Model/payRateSettings';
import { PayRateRule } from '../../../../../../Model/payRateRule';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'payRate-details',
    templateUrl: 'payRate-detail.component.html',
    styleUrls: ['payRate-detail.component.scss']
})
export class PayRateComponent implements OnInit {
    private notifier: NotifierService;
    payRates: PayRateSettings[] = Array<PayRateSettings>();
    payRateRules: PayRateRule[] = Array<PayRateRule>();
    position: FormGroup;
    msg: string;
    positions: PayRateSettings[];
    constructor(private fb: FormBuilder, notifier: NotifierService, private districtService: DistrictService,
        private userSession: UserSession) {
        this.notifier = notifier;
    }

    ngOnInit() {
        this.getpositions();
        this.getPayRates();
        this.getPayRatesRule();
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

    getPayRates(): void {
        let DistrictId = this.userSession.getUserDistrictId();
        this.districtService.getById('user/getPayRate', DistrictId).subscribe((data: any) => {
            this.payRates = data;
            for (let i = 0; i < 1; i++) {
                this.payRates.push(new PayRateSettings());
            }
        },
            error => this.msg = <any>error);
    }

    getPayRatesRule(): void {
        let DistrictId = this.userSession.getUserDistrictId();
        this.districtService.getById('user/getPayRateRule', DistrictId).subscribe((data: any) => {
            this.payRateRules = data;
            for (let i = 0; i < 1; i++) {
                this.payRateRules.push(new PayRateRule());
            }
        },
            error => this.msg = <any>error);
    }

    postPayRate(payRate: any) {
        payRate.districtId = this.userSession.getUserDistrictId();
        if (payRate.positionId && payRate.payRate && payRate.period) {
            if (payRate.id > 0) {
                this.districtService.Patch('user/payRate/', payRate).subscribe((data: any) => {
                    this.getPayRates();
                    this.notifier.notify('success', 'Updated Successfully!');
                },
                    error => this.msg = <any>error);
            }
            else {
                this.districtService.post('user/payRate/', payRate).subscribe((data: any) => {
                    this.getPayRates();
                    this.notifier.notify('success', 'Saved Successfully!');
                },
                    error => this.msg = <any>error);
            }
        }
        else {
            this.notifier.notify('error', 'Fill all fields.');
        }
    }

    postPayRateRule(payRateRule: any) {
        payRateRule.districtId = this.userSession.getUserDistrictId();
        if (payRateRule.positionId && payRateRule.payRate && payRateRule.increaseAfterDays) {
            if (payRateRule.id > 0) {
                this.districtService.Patch('user/payRateRule/', payRateRule).subscribe((data: any) => {
                    this.notifier.notify('success', 'Updated Successfully!');
                    this.getPayRatesRule();
                },
                    error => this.msg = <any>error);
            }
            else {
                this.districtService.post('user/payRateRule/', payRateRule).subscribe((data: any) => {
                    this.getPayRatesRule();
                    this.notifier.notify('success', 'Saved Successfully!');
                },
                    error => this.msg = <any>error);
            }
        }
        else {
            this.notifier.notify('error', 'Fill all fields.');
        }
    }

    onDeletePayRate(id: number) {
        if (!id || id === 0)
        return;
        this.districtService.delete('user/deletePayRate/', id).subscribe((data: any) => {
            this.getPayRates();
            this.notifier.notify('success', 'Deleted Successfully!');
        },
            error => this.msg = <any>error);
    }

    onDeletePayRateRule(id: number) {
        if (!id || id === 0)
        return;
        this.districtService.delete('user/deletePayRateRule/', id).subscribe((data: any) => {
            this.getPayRatesRule();
            this.notifier.notify('success', 'Deleted Successfully!');
        },
            error => this.msg = <any>error);
    }

}