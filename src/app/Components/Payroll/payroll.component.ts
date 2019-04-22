import { Component, ViewChild, OnInit, Inject, ChangeDetectorRef, HostBinding } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MAT_DIALOG_DATA, MatTabGroup } from '@angular/material';
import { IDistrict } from '../../Model/Manage/district';
import { DistrictService } from '../../Service/Manage/district.service';
import { EmployeeService } from '../../Service/Manage/employees.service';
import { DataContext } from '../../Services/dataContext.service';
import { UserSession } from '../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../Service/user.service';
import { MediaMatcher } from '../../../../node_modules/@angular/cdk/layout';

@Component({
    templateUrl: 'payroll.component.html',
    styleUrls: ['payroll.component.scss']
})

export class PayRollComponent implements OnInit {
    SubstituteDetail: any;
    private notifier: NotifierService;
    District: IDistrict;
    positions: any;
    weeklyLimitSettings: FormGroup;
    substituteDataSource = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    userTemplate: any;
    Employees: any
    msg: string;
    isOpen = true;
    mobileQuery: MediaQueryList;
    @HostBinding('class.is-open')
    private _mobileQueryListener: () => void;

    constructor(private router: Router, private _districtService: DistrictService, public dialog: MatDialog,
        private _employeeService: EmployeeService, notifier: NotifierService, private _dataContext: DataContext,
        changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
        public sanitizer: DomSanitizer, private _userSession: UserSession, private fb: FormBuilder, private userService: UserService) {
        this.notifier = notifier;
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
    ngOnInit(): void {
        this.intializeForms();
        this.GetPositions();
        this.LoadUserResources();
    }

    LoadUserResources(): void {

        let resourceTypeId = 2;
        let parentResourceTypeId = -1;
        let adminPortal = 0;
        this.userService.getUserResources(resourceTypeId, parentResourceTypeId, adminPortal).subscribe((data: any) => {
            this.userTemplate = data;
        },
            error => this.msg = <any>error);
            
    }

    ngAfterViewInit() {

    }

    intializeForms() {
        this.weeklyLimitSettings = this.fb.group({
            weeklyHourLimit: [{ value: '', disabled: true }],
            isWeeklyLimitApplicable: [{ value: false, disabled: true }],
            deductAfterTime: [{ value: '1' }],
            isDeductOnBreak: [{ value: false }]
        });
    }

    GetPositions(): void {
        this._dataContext.get('user/getUserTypes').subscribe((data: any) => {
            this.positions = data;
        },
            error => <any>error);
    }

    onUpdateweeklyLimitSetting(settings: FormGroup) {
        if (settings.valid) {
            let model = {
                districtId: this._userSession.getUserDistrictId(),
                weeklyHourLimit: settings.value.weeklyHourLimit,
                isWeeklyLimitApplicable: settings.value.isWeeklyLimitApplicable,
                deductAfterTime: settings.value.deductAfterTime,
                isDeductOnBreak: settings.value.isDeductOnBreak
            }
            this._districtService.post('District/updateSettings', model).subscribe((data: any) => {
                this.notifier.notify('success', 'Updated Successfully');
            },
                (err: HttpErrorResponse) => {
                    this.notifier.notify('error', err.error.error_description);
                });
        }
    }

    onTabChanged(tab: any) {
        if (tab.index === 1) {
            this._districtService.getById('district/getDistrictById', this._userSession.getUserDistrictId()).subscribe((data: any) => {
                this.weeklyLimitSettings.patchValue({...data[0]});
            },
                error => this.msg = <any>error);
        }
    }

    onEditHourLimit() {
        this.weeklyLimitSettings.controls['weeklyHourLimit'].enable();
        this.weeklyLimitSettings.controls['isWeeklyLimitApplicable'].enable();
    }

    toggle() {
    }
}

