import { Component, ViewChild, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DataContext } from '../../../../Services/dataContext.service';
import { CommunicationService } from '../../../../Services/communication.service';
import { UserSession } from '../../../../Services/userSession.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AuditFilter } from '../../../../Model/auditLog';
import { AuditLogService } from '../../../../Services/audit_logs/audit-log.service';
@Component({
    selector: 'past-absences',
    templateUrl: 'pastAbsence.component.html'
})
export class PastAbsenceComponent implements OnInit {
    loginUserRole: number;
    CurrentDate: Date = new Date;
    private notifier: NotifierService;
    PastAbsences = new MatTableDataSource();
    msg: string;
    currentDate: Date = new Date();
    displayedColumns = ['AbsenceDate', 'Posted', 'Location', 'Status', 'Substitute', 'Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    FileStream: any;
    insertAbsencesLogView: any;

    constructor(private _dataContext: DataContext, private _userSession: UserSession,
        notifier: NotifierService, private _communicationService: CommunicationService,
        private auditLogService: AuditLogService) 
        { this.notifier = notifier; this.loginUserRole = _userSession.getUserRoleId() }
    ngOnInit(): void {
        this.GetAbsences();
    }

    ngAfterViewInit() {
        this.PastAbsences.sort = this.sort;
        this.PastAbsences.paginator = this.paginator;   
    }

    GetAbsences(): void {
        let StartDate = new Date();
        let EndDate = this.CurrentDate.toISOString();
        StartDate.setDate(this.currentDate.getDate() - 30);
        let UserId = this._userSession.getUserId();
        this._dataContext.get('Absence/getAbsences' + "/" + StartDate.toISOString() + "/" + EndDate + "/" + UserId).subscribe((data: any) => {
            this.PastAbsences.data = data;
        },
            error => this.msg = <any>error);
    }

    UpdateStatus(SelectedRow: any, StatusId: number) {
        let confirmResult = confirm('Are you sure you want to cancel this absence?');
        if (confirmResult) {
            this._dataContext.UpdateAbsenceStatus('Absence/updateAbseceStatus', SelectedRow.absenceId, StatusId, this.currentDate.toISOString(), this._userSession.getUserId()).subscribe((response: any) => {
                if (response == "success") {
                    this.notifier.notify('success', 'Cancelled Successfully.');
                    this.GetAbsences();
                }
            },
                error => this.msg = <any>error);
        }
    }

    ShowAbsenceDetail(AbsenceDetail: any) {      
        this._communicationService.ViewAbsenceDetail(AbsenceDetail);
        const model = new AuditFilter();
        model.entityId = AbsenceDetail.absenceId;
        this.auditLogService.insertAbsencesLogView(model).subscribe((result: any) => {
            this.insertAbsencesLogView = result;
        });
    }
}