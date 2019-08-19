import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DataContext } from '../../../../Services/dataContext.service';
import { UserSession } from '../../../../Services/userSession.service';
import { IEmployee } from '../../../../Model/Manage/employee';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NotifierService } from 'angular-notifier';
import { PopupDialogForEmployeeDetail } from './popups/viewEmployee.popup.component';
import { User } from '../../../../Model/user';
import swal from 'sweetalert2';

@Component({
  templateUrl: 'employees.component.html',
  styleUrls: ['employee.component.css']
})
export class EmployeesComponent implements OnInit {
  private notifier: NotifierService;
  displayedColumns = ['firstName', 'LastName', 'Email', 'PhoneNumber', 'location', 'Role', 'ClassificationStatus', 'action'];
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
  Districts: any;
  selectedDistrictIdForFilter: number = 0;
  UserRole: number = this._userSession.getUserRoleId();
  districtIdForWelcome: any = 0;

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
    this.GetDistricts();
    this.GetStaff();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       return this.DataSourceEmployeesObj!.getRepoIssues(
    //         this.sort.active, this.sort.direction, this.paginator.pageIndex);
    //     }),
    //     map((data: any) => {
    //       // Flip flag to show that loading has finished.
    //       this.isLoadingResults = false;
    //       this.isRateLimitReached = false;
    //       this.resultsLength = data.length;
    //       return data;
    //     }),
    //     catchError(() => {
    //       this.isLoadingResults = false;
    //       return observableOf([]);
    //     })
    //   ).subscribe((data: any) => this.dataSource.data = data);

    this.dataSource.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);
      const schoolTile = 'organizationName';
      const districtTitle = 'districtName';
      const nameTitle = 'firstName';
      const disIdTitle = 'districtId';
      const sch = data[schoolTile] === null ? '' : data[schoolTile];
      const dis = data[districtTitle] === null ? '' : data[districtTitle];
      const name = data[nameTitle] === null ? '' : data[nameTitle];
      const disId = data[disIdTitle] === null ? '' : data[disIdTitle];
      matchFilter.push((sch.toLowerCase().includes(this.location.toLowerCase()) ||
        dis.toLowerCase().includes(this.location.toLowerCase()))
        && (name.toLowerCase().includes(this.employeeName.toLowerCase())) &&
        (this.selectedDistrictIdForFilter > 0 &&
          disId == this.selectedDistrictIdForFilter ? true : this.selectedDistrictIdForFilter > 0
            && disId != this.selectedDistrictIdForFilter ? false : true));
      return matchFilter.every(Boolean)
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

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
    swal.fire({
      title: 'Delete',
      text:
        'Are you sure, you want to delete the selected Employee?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-danger',
      cancelButtonClass: 'btn btn-success',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then(r => {
      if (r.value) {
        this._dataContext.delete('user/', SelectedRow.userId).subscribe((data: any) => {
          this.notifier.notify('success', 'Deleted Successfully');
          this.ngOnInit();
        },
          error => this.msg = <any>error);
      }
    });
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
          this.notifier.notify('success', 'Sent Successfully');
        },
          error => this.msg = <any>error);
      }
    });
  }

  ViewEmployeeDetail(SelectedRow: any) {
    this._dataContext.getById('user/getUserById', SelectedRow.userId).subscribe((data: any) => {
      this.dialog.open(PopupDialogForEmployeeDetail, {
        data,
        height: '500px',
        width: '650px',

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
  GetDistricts(): void {
    this._dataContext.get('district/getDistricts').subscribe((data: any) => {
      this.Districts = data;
    },
      error => <any>error);
  }

  onChangeDistrict(districtId: any) {
    this.selectedDistrictIdForFilter = districtId;
    const tableFilters = [];
    tableFilters.push({
      id: 'districtId',
      value: districtId
    });
    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onSendAll(){
    if(this.districtIdForWelcome == 0){
      this.districtIdForWelcome = this._userSession.UserClaim.districtId;
      if(this.districtIdForWelcome == 0)
      {
        this.notifier.notify('error', 'Please Select District First.');
        return;
      }
    }
    this._dataContext.get('user/sendWellcomeLetterToAll/' + this.districtIdForWelcome).subscribe((response : any) => {
      this.notifier.notify('success', 'Email Sent Successfully.');
    },
      error => this.notifier.notify('error', 'Please Select District First'));
  }

  GetStaff(): void {
    let RoleId = 3;
    let OrgId = this._userSession.getUserOrganizationId();
    let DistrictId = this._userSession.getUserDistrictId();
    this._dataContext.get('user/getUsers' + '/' + RoleId + '/' + OrgId + '/' + DistrictId).subscribe((data: any) => {
      this.dataSource.data = data;
      // this.lastActiveDaysTemp = moment(data.lastActive).format('YYYY-MM-DD');
      // this.lastActiveDays = Math.abs(this.currentDate.diff(this.lastActiveDaysTemp, 'days'));
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
  constructor(
    private _dataContext: DataContext,
    private _UserSession: UserSession) { }

  getRepoIssues(sort: string, order: string, page: number): Observable<IEmployee[]> {
    let RoleId = 3;
    let OrgId = this._UserSession.getUserOrganizationId();
    let DistrictId = this._UserSession.getUserDistrictId();
    return this._dataContext.get('user/getUsers' + '/' + RoleId + '/' + OrgId + '/' + DistrictId);
  }

}