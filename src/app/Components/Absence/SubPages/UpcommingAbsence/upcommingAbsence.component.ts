import { Component, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DataContext } from '../../../../Services/dataContext.service';
import { CommunicationService } from '../../../../Services/communication.service';
import { UserSession } from '../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { AuditFilter } from '../../../../Model/auditLog';
import { AuditLogService } from '../../../../Services/audit_logs/audit-log.service';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { ReportDetail } from 'src/app/Model/Report/report.detail';
import { ReportDetailsComponent } from 'src/app/Components/Reports/popups/report-details.popup.component';

@Component({
    selector: 'upcoming-absences',
    templateUrl: 'upcommingAbsence.component.html',
    styleUrls: ['upcommingAbsence.component.scss']
})
export class UpcommingAbsenceComponent implements OnInit {
    @Output() refreshBalance = new EventEmitter<string>();
    CurrentDate: Date = new Date;
    private notifier: NotifierService;
    UpcommingAbsences = new MatTableDataSource();
    msg: string;
    currentDate: Date = new Date();
    displayedColumns = ['AbsenceDate', 'JobId', 'Posted', 'Location', 'Status', 'Substitute', 'Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    FileStream: any;
    insertAbsencesLogView: any;

    constructor(
        private _dataContext: DataContext,
        private _userSession: UserSession,
        notifier: NotifierService,
        private _communicationService: CommunicationService,
        private auditLogService: AuditLogService,
        private dialogRef: MatDialog) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.GetAbsences();
        this._communicationService.UpdateEmployeeLeaveBalance();
    }

    ngAfterViewInit() {
        this.UpcommingAbsences.sort = this.sort;
        this.UpcommingAbsences.paginator = this.paginator;
    }

    GetAbsences(): void {
        let StartDate = this.CurrentDate.toISOString();
        let EndDate = new Date();
        EndDate.setDate(this.currentDate.getDate() + 365);
        let UserId = this._userSession.getUserId();
        this._dataContext.get('Absence/getAbsences' + "/" + StartDate + "/" + EndDate.toISOString() + "/" + UserId).subscribe((data: any) => {
            this.UpcommingAbsences.data = data;
        },
            error => this.msg = <any>error);
    }

    ShowDetail(AbsenceDetail: any) {
        this._communicationService.ViewAbsenceDetail(AbsenceDetail);
        const model = new AuditFilter();
        model.entityId = AbsenceDetail.confirmationNumber;
        this.auditLogService.insertAbsencesLogView(model).subscribe((result: any) => {
            this.insertAbsencesLogView = result;
        });
    }

    UpdateStatus(SelectedRow: any, StatusId: number) {
        let currentTime = moment();
        let currentDate = moment(this.currentDate).format('MM/DD/YYYY');
        let starttime = moment(SelectedRow.startTime, 'h:mma');
        let endtime = moment(SelectedRow.endTime, 'h:mma');
        let absenceStartDate = moment(SelectedRow.startDate).format('MM/DD/YYYY');
        if (SelectedRow.status == 4) {
            this.notifier.notify('error', 'Job already canceled.');
            return;
        }
        else if (SelectedRow.status == 2) {
            this.notifier.notify('error', 'Job has accepted, you cannot cancel it.');
            return;
        }
        else {
            if (absenceStartDate <= currentDate) {
                if (currentTime > endtime) {
                    this.notifier.notify('error', 'Job has ended, you cannot cancel it.');
                    return;
                }
                else if (currentTime > starttime) {
                    this.notifier.notify('error', 'Job has started, you cannot cancel it.');
                    return;
                }
            }
        }
        swal.fire({
            title: 'Cancel',
            text:
                'Are you sure you want to cancel this absence?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-success',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then(r => {
            if (r.value) {
                this._dataContext.UpdateAbsenceStatus('Absence/updateAbseceStatus', SelectedRow.confirmationNumber, SelectedRow.absenceId, StatusId, this.currentDate.toISOString(), this._userSession.getUserId()).subscribe((response: any) => {
                    if (response == "success") {
                        if (this._userSession.getUserRoleId() === 3) this.refreshBalance.next();
                        this.notifier.notify('success', 'Cancelled Successfully.');
                        this.GetAbsences();
                    }
                },
                    error => this.msg = <any>error);
            }
        });
    }

    EditAbsence(absenceDetail: any) {
        let modeldata = new ReportDetail();
        modeldata.confirmationNumber = absenceDetail.confirmationNumber;
        modeldata.reason = absenceDetail.absenceReasonDescription;
        modeldata.absenceId = absenceDetail.absenceId;
        modeldata.startDate = absenceDetail.startDate;
        modeldata.endDate = absenceDetail.endDate;
        modeldata.startTime = absenceDetail.startTime;
        modeldata.endTime = absenceDetail.endTime;
        modeldata.endTime = absenceDetail.endTime;
        modeldata.absenceType = absenceDetail.absenceType;
        modeldata.substituteRequired = absenceDetail.substituteRequired;
        modeldata.statusId = absenceDetail.status;
        modeldata.statusTitle = absenceDetail.absenceStatusDescription;
        modeldata.substituteId = absenceDetail.substituteId;
        modeldata.substituteName = absenceDetail.substituteName;
        modeldata.substituteId = absenceDetail.substituteId;
        modeldata.postedOn = absenceDetail.createdDate;
        modeldata.notes = absenceDetail.substituteNotes;
        modeldata.anyAttachment = absenceDetail.anyAttachment;
        modeldata.attachedFileName = absenceDetail.attachedFileName;
        modeldata.fileContentType = absenceDetail.fileContentType;
        modeldata.originalFileName = absenceDetail.originalFileName;
        modeldata.employeeProfilePicUrl = absenceDetail.employeeProfilePicUrl;
        modeldata.absenceResendCounter = absenceDetail.absenceResendCounter;
        modeldata.acceptedVia = absenceDetail.acceptedVia;
        modeldata.callingPage = 'Absence';

        const model = new AuditFilter();
        model.entityId = absenceDetail.confirmationNumber;
        this.auditLogService.insertAbsencesLogView(model).subscribe((result: any) => {
            this.insertAbsencesLogView = result;
        });

        const dialogEdit = this.dialogRef.open(
            ReportDetailsComponent, {
                panelClass: 'report-details-dialog',
                data: modeldata
            }
        );
        dialogEdit.afterClosed().subscribe(result => {
            if (result == 'Reload') {
                this.GetAbsences();
            }
        });
    }
}