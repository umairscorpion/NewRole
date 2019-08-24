import { Component, ViewChild, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IDistrict } from '../../../../Model/Manage/district';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { EmployeeService } from '../../../../Service/Manage/employees.service';
import { DataContext } from '../../../../Services/dataContext.service';
import { UserSession } from '../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { User } from '../../../../Model/user';
import swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { PopupDialogForNotificationSettings } from './SubPages/popups/notification-settings.popup';

@Component({
  templateUrl: 'substitutes.component.html',
  styleUrls: ['substitutes.component.css']
})
export class SubstitutesComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'Position', 'isCertified', 'Email', 'PhoneNumber', 'Active', 'action'];
  SubstituteDetail: any;
  substituteName: string = '';
  private notifier: NotifierService;
  District: IDistrict;
  positions: any;
  weeklyLimitSettings: FormGroup;
  substituteDataSource = new MatTableDataSource();
  currentDate = moment();
  lastActiveDaysTemp: any;
  lastActiveDays: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sortt: MatSort;
  Employees: any
  msg: string;
  Districts: any;
  UserRole: number = this._userSession.getUserRoleId();
  selectedTab: any = 0;
  districtIdForWelcome: any = 0;
  userRole: any;

  constructor(
    private router: Router,
    private _districtService: DistrictService,
    public dialog: MatDialog,
    private _employeeService: EmployeeService,
    notifier: NotifierService,
    private _dataContext: DataContext,
    public sanitizer: DomSanitizer,
    private _userSession: UserSession,
    private fb: FormBuilder) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    this.intializeForms();
    this.GetSustitutes();
    this.GetPositions();
    this.GetDistricts();
    this.substituteDataSource.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter = [];
      const nameTitle = 'firstName';
      const name = data[nameTitle] === null ? '' : data[nameTitle];
      matchFilter.push(name.toLowerCase().includes(this.substituteName.toLowerCase()));
      return matchFilter.every(Boolean)
    };
  }

  ngAfterViewInit() {
    this.substituteDataSource.sort = this.sortt;
    this.substituteDataSource.paginator = this.paginator;
  }


  intializeForms() {
    this.weeklyLimitSettings = this.fb.group({
      WeeklyHourLimit: [{ value: '', disabled: true }],
      IsWeeklyLimitApplicable: [{ value: false, disabled: true }]
    });
  }

  GetSustitutes(): void {
    let RoleId = 4;
    let OrgId = -1;
    let DistrictId = this._userSession.getUserDistrictId();
    this._employeeService.get('user/getUsers', RoleId, OrgId, DistrictId).subscribe((data: any) => {
      this.substituteDataSource.data = data;
      // this.lastActiveDaysTemp = moment(data.lastActive).format('YYYY-MM-DD');
      // this.lastActiveDays = Math.abs(this.currentDate.diff(this.lastActiveDaysTemp, 'days'));
    },
      error => this.msg = <any>error);
  }

  applyFilter(employeeName: any) {
    const tableFilters = [];
    tableFilters.push({
      id: 'firstName',
      value: employeeName.value
    });

    this.substituteDataSource.filter = JSON.stringify(tableFilters);
    if (this.substituteDataSource.paginator) {
      this.substituteDataSource.paginator.firstPage();
    }
  }

  DeleteSubstitute(SelectedRow: any) {
    swal.fire({
      title: 'Delete',
      text:
        'Are you sure, you want to delete the selected Substitute?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-danger',
      cancelButtonClass: 'btn btn-success',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then(r => {
      if (r.value) {
        this._districtService.delete('user/', SelectedRow.userId).subscribe((data: any) => {
          this.notifier.notify('success', 'Deleted Successfully');
          this.GetSustitutes();
        },
          error => this.msg = <any>error);
      }
    });
  }

  onChangeDistrict(districtId: any) {
    let RoleId = 4;
    let OrgId = -1;
    this.districtIdForWelcome = districtId;
    this._dataContext.get('user/getUsers' + '/' + RoleId + '/' + OrgId + '/' + districtId).subscribe((data: any) => {
      this.substituteDataSource.data = data;
      this.substituteDataSource = data.filter((t => t.districtId == districtId));
    },
      error => this.msg = <any>error);
  }

  ResendWelcomeLetter(user: any) {
    swal.fire({
      title: 'Send',
      text:
        'Are you sure, you want to resend welcome letter?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-danger',
      cancelButtonClass: 'btn btn-success',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then(r => {
      if (r.value) {
        this._dataContext.post('user/resendWelcomeLetter', user).subscribe((data: any) => {
          setTimeout(() => {
            this.GetSustitutes();
          }, 2500);
          this.notifier.notify('success', 'Sent Successfully');
        },
          error => this.msg = <any>error);
      }
    });
  }

  EditSubstitute(SelectedRow: any) {
    this.router.navigate(['/manage/substitutes/addSubstitute'], { queryParams: { Id: SelectedRow.userId } });
  }

  UpdateSubstituteStatus(row: any) {
    row.isActive = !row.isActive;
    this._dataContext.Patch('user/updateUserStatus', row).subscribe((data: any) => {
    },
      error => this.msg = <any>error);
  }

  ViewSubstituteDetail(SelectedRow: any) {
    this._dataContext.getById('user/getUserById', SelectedRow.userId).subscribe((data: any) => {
      this.dialog.open(PopupDialogForSubstituteDetail, {
        data,
        height: '500px',
        width: '650px',
      });
    },
      error => <any>error);
  }

  ViewSubstituteNotificationSettings(SelectedRow: any) {
    this.dialog.open(PopupDialogForNotificationSettings, {
      data: SelectedRow.userId,
      height: '718px',
      width: '650px',
    });
  }

  sendWelcomeLetter(user: User) {
    let userToSendWelcomeLetter = {
      userId: user.userId,
      email: user.email,
      password: user.password,
      firstName: user.firstName
    }
    this._dataContext.post('Communication/sendWellcomeLetter', userToSendWelcomeLetter).subscribe(result => {
      this.notifier.notify('success', 'Email Send Successfully.');
      this.GetSustitutes();
    },
      error => this.msg = <any>error);
  }

  onSendAll() {
    this.userRole = 4;
    if (this.districtIdForWelcome == 0) {
      this.districtIdForWelcome = this._userSession.UserClaim.districtId;
      if (this.districtIdForWelcome == 0) {
        this.notifier.notify('error', 'Please Select District First.');
        return;
      }
    }
    this._dataContext.get('user/sendWellcomeLetterToAll/' + this.districtIdForWelcome + '/' + this.userRole).subscribe((response: any) => {
      this.notifier.notify('success', 'Email Sent Successfully.');
      setTimeout(() => {
        this.GetSustitutes();
      }, 5000);
    },
      error => this.notifier.notify('error', 'Please Select District First'));
  }

  resetPassword(userdId: string) {
    let model = {
      userId: userdId,
      password: '1234567890'
    }
    this._dataContext.post('user/updatePassword', model).subscribe(result => {
      this.notifier.notify('success', 'The password for the selected account has been reset to the schools default password.');
    },
      error => this.msg = <any>error);
  }

  GetPositions(): void {
    this._dataContext.get('user/getUserTypes').subscribe((data: any) => {
      this.positions = data;
    },
      error => <any>error);
  }
  GetDistricts(): void {
    this._dataContext.get('district/getDistricts').subscribe((data: any) => {
      this.Districts = data;
    },
      error => <any>error);
  }

  onTabChanged(tab: any) {
    this.selectedTab = tab.index;
  }

  getSettings() {
  }
}

@Component({
  templateUrl: 'viewSubstitute.html',
  styleUrls: ['substitute-detail.popup.component.scss']
})
export class PopupDialogForSubstituteDetail {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<SubstitutesComponent>) {
    console.log(data);
  }

  getImage(imageName: string) {
    if (imageName && imageName.length > 0) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(environment.profileImageUrl + imageName);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}

