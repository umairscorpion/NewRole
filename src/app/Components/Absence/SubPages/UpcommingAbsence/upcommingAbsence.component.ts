import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { DataContext } from '../../../../Services/dataContext.service';
import { CommunicationService } from '../../../../Services/communication.service';
import { UserSession } from '../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { AuditFilter } from '../../../../Model/auditLog';
import { AuditLogService } from '../../../../Services/audit_logs/audit-log.service';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
    selector: 'upcoming-absences',
    templateUrl: 'upcommingAbsence.component.html'
})
export class UpcommingAbsenceComponent implements OnInit {
    CurrentDate: Date = new Date;
    private notifier: NotifierService;
    UpcommingAbsences = new MatTableDataSource();
    msg: string;
    currentDate: Date = new Date();
    displayedColumns = ['AbsenceDate', 'Posted', 'Location', 'Status', 'Substitute', 'Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    FileStream: any;
    insertAbsencesLogView: any;

    constructor(
        private _dataContext: DataContext,
        private _userSession: UserSession,
        notifier: NotifierService,
        private _communicationService: CommunicationService,
        private auditLogService: AuditLogService) {
        this.notifier = notifier;
    }

    ngOnInit(): void {
        this.GetAbsences();
    }

    ngAfterViewInit() {
        this.UpcommingAbsences.sort = this.sort;
        this.UpcommingAbsences.paginator = this.paginator;
    }

    GetAbsences(): void {
        let StartDate = this.CurrentDate.toISOString();
        let EndDate = new Date();
        EndDate.setDate(this.currentDate.getDate() + 30);
        let UserId = this._userSession.getUserId();
        this._dataContext.get('Absence/getAbsences' + "/" + StartDate + "/" + EndDate.toISOString() + "/" + UserId).subscribe((data: any) => {
            this.UpcommingAbsences.data = data;
        },
            error => this.msg = <any>error);
    }

    ShowDetail(AbsenceDetail: any) {
        this._communicationService.ViewAbsenceDetail(AbsenceDetail);
        const model = new AuditFilter();
        model.entityId = AbsenceDetail.absenceId;
        this.auditLogService.insertAbsencesLogView(model).subscribe((result: any) => {
            this.insertAbsencesLogView = result;
        });
    }

    UpdateStatus(SelectedRow: any, StatusId: number) {
        let absenceStartDate = moment(SelectedRow.startDate).format('MM/DD/YYYY');
        let currentDate = moment(this.currentDate).format('MM/DD/YYYY');
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
                if (absenceStartDate <= currentDate) {
                    this.notifier.notify('error', 'Not able to cancel now');
                    return;
                }
                this._dataContext.UpdateAbsenceStatus('Absence/updateAbseceStatus', SelectedRow.absenceId, StatusId, this.currentDate.toISOString(), this._userSession.getUserId()).subscribe((response: any) => {
                    if (response == "success") {
                        this.notifier.notify('success', 'Cancelled Successfully.');
                        this.GetAbsences();
                    }
                },
                    error => this.msg = <any>error);
            }
        });
    }
}