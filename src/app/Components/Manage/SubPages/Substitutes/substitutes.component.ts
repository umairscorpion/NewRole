import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MAT_DIALOG_DATA, MatTabGroup } from '@angular/material';
import { IDistrict } from '../../../../Model/Manage/district';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { EmployeeService } from '../../../../Service/Manage/employees.service';
import { DataContext } from '../../../../Services/dataContext.service';
import { UserSession } from '../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  templateUrl: 'substitutes.component.html',
  styleUrls: ['substitutes.component.css']
})
export class SubstitutesComponent implements OnInit {
  displayedColumns = ['FirstName', 'LastName', 'Position', 'Email', 'PhoneNumber', 'Active', 'action'];
  SubstituteDetail: any;
  private notifier: NotifierService;
  District: IDistrict;
  positions: any;
  weeklyLimitSettings: FormGroup;
  substituteDataSource = new MatTableDataSource();
  currentDate = moment();
  lastActiveDaysTemp: any;
  lastActiveDays: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  Employees: any
  msg: string;
  constructor(private router: Router, private _districtService: DistrictService, public dialog: MatDialog,
    private _employeeService: EmployeeService, notifier: NotifierService, private _dataContext: DataContext,
    public sanitizer: DomSanitizer, private _userSession: UserSession, private fb: FormBuilder) {
    this.notifier = notifier;
  }
  ngOnInit(): void {
    this.intializeForms();
    this.GetSustitutes();
    this.GetPositions();
  }
  ngAfterViewInit() {
    this.substituteDataSource.sort = this.sort;
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

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.substituteDataSource.filter = filterValue;
  }

  DeleteSubstitute(SelectedRow: any) {
    var confirmResult = confirm('Are you sure you want to delete Substitute?');
    if (confirmResult) {
      this._districtService.delete('user/', SelectedRow.userId).subscribe((data: any) => {
        this.notifier.notify('success', 'Deleted Successfully');
        this.GetSustitutes();
      },
        error => this.msg = <any>error);
    }
  }

  EditSubstitute(SelectedRow: any) {
    this.router.navigate(['/manage/substitutes/addSubstitute'], { queryParams: { Id: SelectedRow.userId } });
  }

  updateSubstitute(row: any) {
    row.isActive = !row.isActive;
    this._dataContext.Patch('user/updateUser', row).subscribe((data: any) => {
    },
      error => this.msg = <any>error);
  }

  ViewSubstituteDetail(SelectedRow: any) {
    this._dataContext.getById('user/getUserById', SelectedRow.userId).subscribe((data: any) => {
      this.dialog.open(PopupDialogForSubstituteDetail, {
        data,
        height: '500px',
        width: '750px',
      });
    },
      error => <any>error);
  }

  GetPositions(): void {
    this._dataContext.get('user/getUserTypes').subscribe((data: any) => {
      this.positions = data;
    },
      error => <any>error);
  }

  onTabChanged(tab: any) {

  }

  getSettings() {

  }
}

@Component({
  templateUrl: 'viewSubstitute.html',
  styleUrls: ['substitutes.component.css']
})
export class PopupDialogForSubstituteDetail {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer) {
    console.log(data);
  }
}

