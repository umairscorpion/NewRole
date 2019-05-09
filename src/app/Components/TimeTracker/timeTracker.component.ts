import { Component, ChangeDetectorRef, HostBinding, Inject } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { TimeClockService } from '../../Services/timeClock.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SideNavService } from '../SideNav/sideNav.service';
import { CommunicationService } from '../../Services/communication.service';
import { UserSession } from '../../Services/userSession.service';
import { OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeClock } from 'src/app/Model/timeclock'
import * as moment from 'moment';
import { EmployeeService } from 'src/app/Service/Manage/employees.service';
import { DataContext } from 'src/app/Services/dataContext.service';
import { t } from '@angular/core/src/render3';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TimeClockFilter } from 'src/app/Model/timeclock.filter';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { SelectionModel } from '@angular/cdk/collections';
import {EditTimeTracker} from 'src/app/Components/TimeClock/popups/edit-timetracker.popup.component';
import { from } from 'rxjs';
@Component({
    selector:'time-tracker',
    templateUrl: 'timeTracker.component.html',
    styleUrls: ['timeTracker.component.scss']
})
export class TimeTrackerComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    totalMinutes: any;
    totalBreaks: any;
    withoutBreaks: any;
    date: string = moment().format('dddd, MM/DD/YYYY');
    time: string = moment().format('h:mma');
    displayedColumnsForTimeTracker: string[] = ['Date', 'Employee', 'Location', 'Clockin', 'Clockout', 'Duration', 'Break', 'Action'];
    msg: string;
    indLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    private notifier: NotifierService;
    sideNavMenu: any;
    isOpen = true;
    userRole: number = this._userSession.getUserRoleId();
    startDate: string = moment().format('dddd, MM/DD/YYYY');
    startTime: string = moment().format('h:mma');
    userId: string = this._userSession.getUserId();
    timeTrackerDetail = new MatTableDataSource();
    private timeClockFormGroup: FormGroup;
    CurrentDate: Date = new Date;

    // Time Tracker Code
    TimeTrackerFilter: FormGroup;
    allTimeTrackerDataInCurrentState: TimeClock[] = Array<TimeClock>();
    selection = new SelectionModel<TimeClock>(true, []);

    constructor(private router: Router,
        private _userService: UserService,
        public dialog: MatDialog,
        private dataContext: DataContext,
        private _formBuilder: FormBuilder,
        private sideNavService: SideNavService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private _userSession: UserSession,
        private timeClockService: TimeClockService,
        notifier: NotifierService,
        private _communicationService: CommunicationService,
        private employeeService: EmployeeService) {
        this.notifier = notifier;
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        //Time Tracker Code
        const first = this.CurrentDate.getDate() - (this.CurrentDate.getDay() - 1);
        const last = first + 4;
        this.intializeFilter(first, last);
    }
    ngOnInit(): void {
        this.GetTimeTrackerData();
        this.LoadSideNavMenu();
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });
    }

    ngAfterViewInit() {
        this.timeTrackerDetail.sort = this.sort;
        this.timeTrackerDetail.paginator = this.paginator;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.timeTrackerDetail.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.timeTrackerDetail.data.forEach((row: TimeClock) => this.selection.select(row));
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    LoadSideNavMenu(): void {
        let resourceTypeId = 2;
        let parentResourceTypeId = -1;
        let adminPortal = 0;
        this._userService.getUserResources(resourceTypeId, parentResourceTypeId, adminPortal).subscribe((data: any) => {
            this.sideNavMenu = data;
        },
            error => this.msg = <any>error);
    }

    GetTimeTrackerData() {
        const filters = TimeClockFilter.initial();
             filters.isDaysSelected = 0;
             filters.startDate = moment().subtract(7, 'days').toISOString();
             filters.endDate = moment(new Date()).toISOString();
             this.timeClockService.getTimeTrackerSummary(filters).subscribe((data: TimeClock[]) => {
                 this.timeTrackerDetail.data = data;
                 this.totalMinutes = data.map((t: TimeClock) => t.totalMinutes).reduce((acc, value) => acc + value, 0);
             },
                error => this.msg = <any>error);
    }


    //Time Tracker Code
    intializeFilter(startDateNumber: number, endDateNumber: number) {
        this.TimeTrackerFilter = this._formBuilder.group({
            dateRange: [{ begin: new Date(this.CurrentDate.setDate(startDateNumber)), end: new Date(this.CurrentDate.setDate(endDateNumber)) }],
            searchBy: ['1'],
            searchByName: ['']
        });
        this.submitForm(this.TimeTrackerFilter);
    }

    submitForm(form: FormGroup) {
        const filters = TimeClockFilter.initial();
        filters.startDate = form.value.dateRange.begin;
        filters.endDate = form.value.dateRange.end;
        this.timeClockService.getTimeClockSummary(filters).subscribe((details: TimeClock[]) => {
            details = details.filter(t => t.statusId === 2 || t.statusId === 3);
            if (+form.value.searchBy === 1) {
                if (form.value.searchByName) {
                    details = details.filter((reportdetail: TimeClock) => reportdetail.employeeName.toLowerCase().includes(form.value.searchByName.toLowerCase()));
                }
            }

            else if (+form.value.searchBy === 2) {
                if (form.value.searchByName) {
                    details = details.filter((reportdetail: TimeClock) => reportdetail.schoolName.toLowerCase().includes(form.value.searchByName.toLowerCase()));
                }
            }

            else {
                if (form.value.searchByName) {
                    details = details.filter((reportdetail: TimeClock) => reportdetail.substituteName.toLowerCase().includes(form.value.searchByName.toLowerCase()));
                }
            }
            this.timeTrackerDetail.data = details;
            this.allTimeTrackerDataInCurrentState = details;
        });
    }

    onExportingToCSV() {
        var configuration = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'Time Tracker Report',
            useBom: false,
            noDownload: false,
            headers: ['Date', 'Employee', 'Location', 'Clock In', 'Clock Out', 'Duration', 'Break']
        };
        let timeTrackerForPrint = this.allTimeTrackerDataInCurrentState.filter(function (timetracker: any) {
            // delete timetracker.userId
            // delete timetracker.startDate
            // delete timetracker.endDate
            // delete timetracker.activity
            // delete timetracker.totalHours
            // delete timetracker.totalMinutes
            // delete timetracker.totalBreaks
            // delete timetracker.totalNoBreaks
            // delete timetracker.schoolName
            // delete timetracker.statusId
            // delete timetracker.substituteName
            // delete timetracker.employeeName
            return true;
        });
        new ngxCsv(JSON.stringify(timeTrackerForPrint), new Date().toLocaleDateString(), configuration);
    }

    onEditPayrollReport() {
        if (this.selection.selected.length > 0) {
            const dialogRef = this.dialog.open(EditTimeTracker, {
                data: this.selection.selected,
                panelClass: 'edit-timetracker-dialog'
            });
            dialogRef.afterClosed().subscribe(result => {
                this.submitForm(this.TimeTrackerFilter);
            });
        }
        else {
            this.notifier.notify('error', 'select Data first then click edit.');
        }
    }
}