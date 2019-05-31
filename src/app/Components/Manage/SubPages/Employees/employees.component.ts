import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DataContext } from '../../../../Services/dataContext.service';
import { UserSession } from '../../../../Services/userSession.service';
import { IEmployee } from '../../../../Model/Manage/employee';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { NotifierService } from 'angular-notifier';
import { PopupDialogForEmployeeDetail } from './popups/viewEmployee.popup.component';
import { User } from '../../../../Model/user';

@Component({
  templateUrl: 'employees.component.html'
})
export class EmployeesComponent implements OnInit {
  private notifier: NotifierService;
  displayedColumns = ['firstName', 'LastName', 'Email', 'PhoneNumber', 'location', 'Role', 'Approver', 'action'];
  DataSourceEmployeesObj: DataSourceEmployees | null;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  employeeName: string = '';
  location: string = '';
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  msg: string;

  constructor(
    private router: Router,
    private _userSession: UserSession,
    public dialog: MatDialog,
    private _dataContext: DataContext,
    notifier: NotifierService) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    this.DataSourceEmployeesObj = new DataSourceEmployees(this._dataContext, this._userSession);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.DataSourceEmployeesObj!.getRepoIssues(
            this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe((data: any) => this.dataSource.data = data);

    this.dataSource.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);

      const schoolTile = 'organizationName';
      const districtTitle = 'districtName';
      const nameTitle = 'firstName';
      const sch = data[schoolTile] === null ? '' : data[schoolTile];
      const dis = data[districtTitle] === null ? '' : data[districtTitle];
      const name = data[nameTitle] === null ? '' : data[nameTitle];
      matchFilter.push((sch.toLowerCase().includes(this.location.toLowerCase()) || dis.toLowerCase().includes(this.location.toLowerCase())) && (name.toLowerCase().includes(this.employeeName.toLowerCase())));
      return matchFilter.every(Boolean);
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // GetEmployees(): void {
  //     let RoleId = 3;
  //     let OrgId = -1;
  //     let DistrictId = -1;
  //     this._EmployeeService.get('user/getEmployees' ,RoleId, OrgId, DistrictId).subscribe((data: any) => {
  //       // this.dataSource.data = data;
  //     },
  //         error => this.msg = <any>error);
  // }

  applyFilter(employeeName: any, Location: any) {
    const tableFilters = [];
    tableFilters.push({
      id: 'organizationName',
      value: Location.value
    });

    tableFilters.push({
      id: 'districtName',
      value: Location.value
    });

    tableFilters.push({
      id: 'firstName',
      value: employeeName.value
    });

    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterOnName(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: 'firstName',
      value: filterValue
    });
    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  DeleteEmployee(SelectedRow: any) {
    var confirmResult = confirm('Are you sure you want to delete Employee?');
    if (confirmResult) {
      this._dataContext.delete('user/', SelectedRow.userId).subscribe((data: any) => {
        this.notifier.notify('success', 'Deleted Successfully');
        this.ngOnInit();
      },
        error => this.msg = <any>error);
    }
  }

  EditEmployee(SelectedRow: any) {
    this.router.navigate(['/manage/employees/addemployee'], { queryParams: { Id: SelectedRow.userId } });
  }

  UpdateEmployeeStatus(row: any) {
    row.isActive = !row.isActive;
    this._dataContext.Patch('user/updateUserStatus', row).subscribe((data: any) => {
    },
      error => this.msg = <any>error);
  }

  ViewEmployeeDetail(SelectedRow: any) {
    this._dataContext.getById('user/getUserById', SelectedRow.userId).subscribe((data: any) => {
      this.dialog.open(PopupDialogForEmployeeDetail, {
        data,
        height: '500px',
        width: '750px',

      });
    },
      error => <any>error);
  }

  sendWelcomeLetter(user: User) {
    let userToSendWelcomeLetter = {
      userId: user.userId,
      email: user.email,
    }
    this._dataContext.post('Communication/sendWellcomeLetter', user).subscribe(result => {
      this.notifier.notify('success', 'Email Send Successfully.');
    },
      error => this.msg = <any>error);
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
}

export class DataSourceEmployees {
  constructor(private _dataContext: DataContext, private _UserSession: UserSession) { }
  getRepoIssues(sort: string, order: string, page: number): Observable<IEmployee[]> {
    let RoleId = 3;
    let OrgId = this._UserSession.getUserOrganizationId();
    let DistrictId = this._UserSession.getUserDistrictId();
    return this._dataContext.get('user/getUsers' + '/' + RoleId + '/' + OrgId + '/' + DistrictId);
  }
}