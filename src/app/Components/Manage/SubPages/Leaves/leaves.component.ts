import { Component, OnInit, ViewChild } from '@angular/core';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { UserSession } from '../../../../Services/userSession.service';
import { AbsenceService } from '../../../../Services/absence.service';
import { LeaveType } from '../../../../Model/leaveType';
import { DataContext } from '../../../../Services/dataContext.service';
import { LeaveRequest } from '../../../../Model/leaveRequest';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    templateUrl: 'leaves.component.html'
})
export class LeavesComponent implements OnInit {
    msg: string;
    tabClicked: number;
    displayedColumnsForLeaveTypes = ['LeaveTypeName', 'Allowance', 'Approval', 'Visible', 'CreatedDate', 'action'];
    displayedColumnsForLeaveRequests = ['select', 'CreatedDate', 'EmployeeName', 'Description', 'EndDate', 'EndTime', 'LeaveTypeName', 'Status'];
    selection = new SelectionModel<any>(true, []);
    dataSourceForLeaveTypes = new MatTableDataSource();
    leaveRequests: any;
    dataSourceForLeaveRequests = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    submittedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    approvedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    deniedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    archivedDeniedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    archivedApprovedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    
    constructor(private _districtService: DistrictService, private userSession: UserSession,
        private absenceService: AbsenceService, private dataContext: DataContext) { }

    ngOnInit(): void {
        this.GetLeaveTypes();
        this.tabClicked = 0;
        this.GetLeaveRequests();
    }

    GetLeaveTypes(): void {
        let districtId = this.userSession.getUserDistrictId();
        let organizationId = this.userSession.getUserOrganizationId() ? this.userSession.getUserOrganizationId() : '-1';
        this.absenceService.getLeaveType(districtId, organizationId).subscribe((data: LeaveType[]) => {
            this.dataSourceForLeaveTypes.data = data;
        },
            error => this.msg = <any>error);
    }

    GetLeaveRequests(): void {
        let districtId = this.userSession.getUserDistrictId();
        let organizationId = this.userSession.getUserOrganizationId() ? this.userSession.getUserOrganizationId() : '-1';
        this.absenceService.getLeaveRequests(districtId, organizationId).subscribe((leaveRequests: LeaveRequest[]) => {
            this.bindData(leaveRequests);
            },
                error => this.msg = <any>error);
    }

    bindData(leaveRequests: LeaveRequest[]) {
        this.submittedLeaveRequests = leaveRequests.filter(t => t.isApproved === false && t.isDeniend === false);
        this.approvedLeaveRequests = leaveRequests.filter(t => t.isApproved === true && t.isDeniend === false);
        this.deniedLeaveRequests = leaveRequests.filter(t => t.isApproved === false && t.isDeniend === true);
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
            this.dataSourceForLeaveRequests.data.forEach((row: any) => this.selection.select(row));
    }

    onApproveClick(leaveRequestId: number) {
        let leaveStatusModel = {
            LeaveRequestId: leaveRequestId,
            IsApproved: 1,
            IsDeniend: 0
        }
        this._districtService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
            this.selection.clear();
            if (this.tabClicked == 0) {
                this.GetLeaveRequests();
            }
            else if (this.tabClicked == 1) {
                this.GetLeaveRequests();
            }
            else {
                this.GetLeaveRequests();
            }
            // this.toastr.success('Status Updated Successfully!', 'Success!');
        },
            (err: HttpErrorResponse) => {
                // this.toastr.error(err.error.error_description, 'Oops!');
            });
    }

    onDenyClick(leaveRequestId: number) {
        let leaveStatusModel = {
            leaveRequestId: leaveRequestId,
            isApproved: 0,
            isDeniend: 1
        }
        this._districtService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
            this.selection.clear();
            if (this.tabClicked == 0) {
                this.GetLeaveRequests();
            }
            else if (this.tabClicked == 1) {
                this.GetLeaveRequests();
            }
            else {
                this.GetLeaveRequests();
            }
            // this.toastr.success('Status Updated Successfully!', 'Success!');
        },
            (err: HttpErrorResponse) => {
                // this.toastr.error(err.error.error_description, 'Oops!');
            });
    }

    tabClick(tab: any) {
        this.selection.clear();
        if (tab.index == 0) {
            this.tabClicked = tab.index;
        }
        else if (tab.index == 1) {
            this.tabClicked = tab.index;
        }
        else {
            this.tabClicked = tab.index;
        }
    }

    applyFilter(filterValue: string) {
        if (this.dataSourceForLeaveTypes.paginator) {
            this.dataSourceForLeaveTypes.paginator.firstPage();
        }
    }
}