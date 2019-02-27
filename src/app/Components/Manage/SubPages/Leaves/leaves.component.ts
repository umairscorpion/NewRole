import { Component, OnInit, ViewChild } from '@angular/core';
import { DistrictService } from '../../../../Service/Manage/district.service';
import {MatPaginator, MatTableDataSource , MatSort} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    templateUrl: 'leaves.component.html'
})
export class LeavesComponent implements OnInit {
    msg: string;
    tabClicked: number;
    displayedColumnsForLeaveTypes = ['LeaveTypeName', 'StartingBalance','action'];
    displayedColumnsForLeaveRequests = ['select','CreatedDate', 'EmployeeName','Description','EndDate', 'EndTime','LeaveTypeName','Status'];
    selection = new SelectionModel<any>(true, []);
    dataSourceForLeaveTypes = new MatTableDataSource();
    dataSourceForLeaveRequests = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
// asd
    constructor(private _districtService :DistrictService) { }
    ngOnInit(): void {
        this.GetLeaveTypes();
        this.tabClicked = 0;
        this.GetLeaveRequests(0,0);
    }
    GetLeaveTypes(): void {
        this._districtService.get('Leave/GetLeaveTypes').subscribe((data: any) => {
          this.dataSourceForLeaveTypes.data = data;
        },
          error => this.msg = <any>error);
    }
    GetLeaveRequests(IsApproved : number , IsDenied: number): void {
        this._districtService.get('Leave/getLeaveRequests/' + IsApproved + '/' + IsDenied).subscribe((data: any) => {
          this.dataSourceForLeaveRequests.data = data;
        },
          error => this.msg = <any>error);
    }
    ngAfterViewInit() {
        this.dataSourceForLeaveRequests.paginator = this.paginator;
        this.dataSourceForLeaveRequests.sort = this.sort;
      }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSourceForLeaveRequests.data.length;
        return numSelected === numRows;
    }
    OnSelectUnselectAll() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSourceForLeaveRequests.data.forEach((row : any) => this.selection.select(row));
      }
    OnApproveClick() {
            for (var i = 0; i < this.selection.selected.length; i++) {
                let leaveStatusModel = {
                    LeaveRequestId: this.selection.selected[i].leaveRequestId,
                    IsApproved: 1,
                    IsDeniend: 0
                }
                this._districtService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
                    this.selection.clear();
                    if(this.tabClicked == 0) {
                        this.GetLeaveRequests(0,0) ;
                    }
                    else if(this.tabClicked == 1) {
                        this.GetLeaveRequests(1,0) ;
                    }
                    else {
                        this.GetLeaveRequests(0,1) ;
                    }
                    // this.toastr.success('Status Updated Successfully!', 'Success!');
                },
                    (err: HttpErrorResponse) => {
                        // this.toastr.error(err.error.error_description, 'Oops!');
                });
            }
    }
    tabClick(tab : any) {
        this.selection.clear();
        if(tab.index == 0) {
            this.tabClicked = tab.index;
            this.GetLeaveRequests(0,0) ;
        }
        else if(tab.index == 1) {
            this.tabClicked = tab.index;
            this.GetLeaveRequests(1,0) ;
        }
        else {
            this.tabClicked = tab.index;
            this.GetLeaveRequests(0,1) ;
        }
    }
    OnDenyClick() {
        for (var i = 0; i < this.selection.selected.length; i++) {
            let leaveStatusModel = {
                leaveRequestId: this.selection.selected[i].leaveRequestId,
                isApproved: 0,
                isDeniend: 1
            }
            this._districtService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
                this.selection.clear();
                if(this.tabClicked == 0) {
                    this.GetLeaveRequests(0,0) ;
                }
                else if(this.tabClicked == 1) {
                    this.GetLeaveRequests(1,0) ;
                }
                else {
                    this.GetLeaveRequests(0,1) ;
                }
                // this.toastr.success('Status Updated Successfully!', 'Success!');
            },
                (err: HttpErrorResponse) => {
                    // this.toastr.error(err.error.error_description, 'Oops!');
            });
        }
    }
    applyFilter(filterValue: string) {
        if (this.dataSourceForLeaveTypes.paginator) {
          this.dataSourceForLeaveTypes.paginator.firstPage();
        }
      }
}
// export interface Element {
//     SubmittedOn: string;
//     Employee: string;
//     Description: string;
//     LeavePeriod: string;
//     Duration: string;
//     LeaveType: string;
//     Status: string;
//   }
  
//   const ELEMENT_DATA: Element[] = [
//     {SubmittedOn: '08-08-2018', Employee: 'Taimoor', Description: 'Sick', LeavePeriod: '7/26/2018 To 7/26/2018' , Duration: '08:00 AM - 16:00 PM', LeaveType: 'Personal Leave', Status: 'Requested'},
//     {SubmittedOn: '08-08-2018', Employee: 'Yusaf', Description: 'Sick', LeavePeriod: '7/26/2018 To 7/26/2018' , Duration: '08:00 AM - 16:00 PM', LeaveType: 'Personal Leave', Status: 'Requested'},
//     {SubmittedOn: '08-08-2018', Employee: 'Rafael', Description: 'Sick', LeavePeriod: '7/26/2018 To 7/26/2018' , Duration: '08:00 AM - 16:00 PM', LeaveType: 'Personal Leave', Status: 'Requested'},
//   ];