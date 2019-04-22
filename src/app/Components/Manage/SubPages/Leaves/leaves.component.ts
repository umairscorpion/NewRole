import { Component, OnInit, ViewChild } from '@angular/core';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { UserSession } from '../../../../Services/userSession.service';
import { AbsenceService } from '../../../../Services/absence.service';
import { LeaveType } from '../../../../Model/leaveType';
import { LeaveRequest } from '../../../../Model/leaveRequest';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { AllowanceComponent } from './popups/add-allowance.popup.component';
import { Allowance } from '../../../../Model/Manage/allowance.detail';
@Component({
    templateUrl: 'leaves.component.html',
    styleUrls: ['leave.component.css']
})
export class LeavesComponent implements OnInit {
    private notifier: NotifierService;
    msg: string;
    tabClicked: number;
    allowances: Allowance[];
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

    constructor(private _districtService: DistrictService, private userSession: UserSession, private router: Router,
        private absenceService: AbsenceService, notifier: NotifierService, public dialog: MatDialog) { this.notifier = notifier; }

    ngOnInit(): void {
        this.GetLeaveTypes();
        this.tabClicked = 0;
        this.GetLeaveRequests();
        this.getAllowances();
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
        this.approvedLeaveRequests = leaveRequests.filter(t => t.isApproved === true && t.isDeniend === false && t.isArchived === false);
        this.deniedLeaveRequests = leaveRequests.filter(t => t.isApproved === false && t.isDeniend === true && t.isArchived === false);
        this.archivedApprovedLeaveRequests = leaveRequests.filter(t => t.isApproved === true && t.isDeniend === false && t.isArchived === true);
        this.archivedDeniedLeaveRequests = leaveRequests.filter(t => t.isApproved === false && t.isDeniend === true && t.isArchived === true);
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
            IsDeniend: 0,
            isArchived: 0
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
            isDeniend: 1,
            isArchived: 0
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

    onArchiveRequest(leaveRequestId: number) {

        let leaveStatusModel = {
            leaveRequestId: leaveRequestId,
            isArchived: 1
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

    deleteLeaveType(leaveTypeId: number): void {
        var confirmResult = confirm('Are you sure you want to delete Leave type?');
        if (confirmResult) {
            this.absenceService.delete('Leave/deleteLeaveType/', leaveTypeId).subscribe((response: any) => {
                if (response === -1) {
                    this.notifier.notify('success', 'Deleted Successfully');
                    this.GetLeaveTypes();
                }
            });
        }
    }

    editLeaveType(leaveTypeId: number): void {
        this.router.navigate(['/manage/leave/AddLeave'], { queryParams: { Id: leaveTypeId } });
    }

    getAllowances() {
        this._districtService.getById('District/getAllowances', this.userSession.getUserDistrictId()).subscribe((allowances: Allowance[]) => {
            this.allowances = allowances;
        },
            (err: HttpErrorResponse) => {
            });
    }

    updateAllowance(allowance: Allowance) {
        allowance.isEnalbled = !allowance.isEnalbled;
        if(+allowance.id > 0) {
            this._districtService.Patch('District/allowances/', allowance).subscribe((data: any) => {
            },
                error => this.msg = <any>error);
        }
    }

    onOpenAllowancePopup() {
        const dialogRef = this.dialog.open(AllowanceComponent, {
            panelClass: 'allowance-popup-dialog'
        }); 
        dialogRef.afterClosed().subscribe(result => {
            this.getAllowances();
        });
    }

    editAllowance(allowance: Allowance) {
        const dialogRef = this.dialog.open(AllowanceComponent, {
            data: allowance,
            panelClass: 'allowance-popup-dialog'
        }); 
        dialogRef.afterClosed().subscribe(result => {
            this.getAllowances();
        });
    }

    deleteAllowance(id: number): void {
        var confirmResult = confirm('Are you sure you want to delete allowance?');
        if (confirmResult) {
            this.absenceService.delete('District/deleteAllowance/', id).subscribe((response: any) => {
                    this.notifier.notify('success', 'Deleted Successfully');
                    this.getAllowances();
            });
        }
    }
}