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
import { Router, ActivatedRoute } from '@angular/router';
import { AllowanceComponent } from './popups/add-allowance.popup.component';
import { Allowance } from '../../../../Model/Manage/allowance.detail';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'leaves.component.html',
    styleUrls: ['leave.component.css']
})
export class LeavesComponent implements OnInit {
    private notifier: NotifierService;
    msg: string;
    tabClicked: number;
    selectedTab: number;
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

    constructor(
        private _districtService: DistrictService,
        private userSession: UserSession,
        private router: Router,
        private absenceService: AbsenceService,
        notifier: NotifierService,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.GetLeaveTypes();
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.Tab) {
                this.selectedTab = 1;
            }
        })
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

    onApproveClick(leaveRequestId: number, absenceId: string) {
        let leaveStatusModel = {
            LeaveRequestId: leaveRequestId,
            IsApproved: 1,
            IsDeniend: 0,
            isArchived: 0,
            AbsenceId: absenceId
        }
        swal.fire({
            title: 'Approve',
            text:
                'Are you sure, you want to Approve the selected Absence Request?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-success',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then(r => {
            if (r.value) {
                this._districtService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
                    this.selection.clear();
                    this.notifier.notify('success', 'Approved Successfully');
                    if (this.tabClicked == 0) {
                        this.GetLeaveRequests();
                    }
                    else if (this.tabClicked == 1) {
                        this.GetLeaveRequests();
                    }
                    else {
                        this.GetLeaveRequests();
                    }
                },
                    (err: HttpErrorResponse) => {
                    });
            }
        });
    }

    onDenyClick(leaveRequestId: number, absenceId: string) {
        let leaveStatusModel = {
            leaveRequestId: leaveRequestId,
            isApproved: 0,
            isDeniend: 1,
            isArchived: 0,
            AbsenceId: absenceId
        }
        swal.fire({
            title: 'Deny',
            text:
                'Are you sure, you want to Deny the selected Absence Request?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-success',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then(r => {
            if (r.value) {
                this._districtService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
                    this.selection.clear();
                    this.notifier.notify('success', 'Denied Successfully');
                    if (this.tabClicked == 0) {
                        this.GetLeaveRequests();
                    }
                    else if (this.tabClicked == 1) {
                        this.GetLeaveRequests();
                    }
                    else {
                        this.GetLeaveRequests();
                    }
                },
                    (err: HttpErrorResponse) => {
                    });
            }
        });
    }

    onArchiveRequest(leaveRequestId: number, absenceId: string) {
        let leaveStatusModel = {
            leaveRequestId: leaveRequestId,
            isArchived: 1,
            AbsenceId: absenceId
        }
        swal.fire({
            title: 'Archive',
            text:
                'Are you sure, you want to Archive the selected Request?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-success',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then(r => {
            if (r.value) {
                this._districtService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
                    this.selection.clear();
                    this.notifier.notify('success', 'Archived Successfully');
                    if (this.tabClicked == 0) {
                        this.GetLeaveRequests();
                    }
                    else if (this.tabClicked == 1) {
                        this.GetLeaveRequests();
                    }
                    else {
                        this.GetLeaveRequests();
                    }
                },
                    (err: HttpErrorResponse) => {
                    });
            }
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

    deleteLeaveType(leaveTypeId: number) {
        swal.fire({
            title: 'Delete',
            text:
                'Are you sure, you want to delete the selected Leave Type?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-success',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then(r => {
            if (r.value) {
                this.absenceService.delete('Leave/deleteLeaveType/', leaveTypeId).subscribe((response: any) => {
                    if (response === -1) {
                        this.notifier.notify('success', 'Deleted Successfully');
                        this.GetLeaveTypes();
                    }
                },
                    error => this.msg = <any>error);
            }
        });
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
        if (+allowance.id > 0) {
            this._districtService.Patch('District/allowances/', allowance).subscribe((data: any) => {
            },
                error => this.msg = <any>error);
        }
    }

    onOpenAllowancePopup() {
        if (this.allowances.length >= 3) {
            this.notifier.notify('error', 'You can add only 3 allowance leave types.');
            return;
        }
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

    deleteAllowance(id: number) {
        swal.fire({
            title: 'Delete',
            text:
                'Are you sure, you want to delete the selected allowance?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-success',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then(r => {
            if (r.value) {
                this.absenceService.delete('District/deleteAllowance/', id).subscribe((response: any) => {
                    this.notifier.notify('success', 'Deleted Successfully');
                    this.getAllowances();
                },
                    error => this.msg = <any>error);
            }
        });
    }

    getImage(imageName: string) {
        if (imageName && imageName.length > 0) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(environment.profileImageUrl + imageName);
        }
    }
}