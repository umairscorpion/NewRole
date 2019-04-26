import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatExpansionPanel, MatDatepickerInputEvent } from '@angular/material';
import { DataContext } from 'src/app/Services/dataContext.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportFilter } from 'src/app/Model/Report/report.filter';
import * as moment from 'moment';
import { UserSession } from 'src/app/Services/userSession.service';
import { AbsenceService } from 'src/app/Services/absence.service';
import { LeaveType } from 'src/app/Model/leaveType';
import { MatDialog } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ReportService } from 'src/app/Services/report.service';
import { DailyReportsComponent } from '../SubPages/DailyReports/dailyReports.component';
import { PopupForCancelAbsencesComponent } from '../popups/cancel-absence.popup.component';

@Component({
  selector: 'app-report-filters',
  templateUrl: 'filters.component.html',
  styleUrls: ['filters.component.scss']
})
export class ReportFiltersComponent implements OnInit {
  @ViewChild('myPanel') myPanel: MatExpansionPanel;
  @ViewChild(DailyReportsComponent) dailyReport: DailyReportsComponent;
  @Input() componentName: string;
  @Output() formAction = new EventEmitter();

  matIcon = 'keyboard_arrow_down' || 'keyboard_arrow_up';
  districts: any;
  reportFilterForm: FormGroup;
  Leaves: any;
  forCancelAbsence: any;
  userTypes: any;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private dataContext: DataContext,
    private _userSession: UserSession,
    private absenceService: AbsenceService,
    private dialogRef: MatDialog,
    private notifier: NotifierService,
    private reportService: ReportService
  ) {
    this.reportFilterForm = this.initReportFilters();
  }

  ngOnInit() {
    this.myPanel.expandedChange.subscribe((data) => {
      this.matIcon = data ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    });
    this.loadData();
    this.GetUserTypes();
  }

  initReportFilters() {
    return ReportFilter.CreateFilterFormGroup(this.fb);
  }

  expandPanel() {
    this.myPanel.expanded = !this.myPanel.expanded;
  }

  loadData() {
    this.dataContext.get('district/getDistricts').subscribe((data: any) => {
      this.districts = data;
    },
      error => <any>error);

    let districtId = this._userSession.getUserDistrictId();
    let organizationId = this._userSession.getUserOrganizationId() ? this._userSession.getUserOrganizationId() : '-1';
    this.absenceService.getLeaveType(districtId, organizationId).subscribe((data: LeaveType[]) => {
      this.Leaves = data;
    },
      error => <any>error);
  }

  onReset() {
    this.reportFilterForm.controls['jobNumber'].setValue('');
    this.reportFilterForm.controls['absenceTypeId'].setValue(0);
    this.reportFilterForm.controls['districtId'].setValue(0);
    this.reportFilterForm.controls['reasonId'].setValue(0);
    this.reportFilterForm.controls['employeeName'].setValue('');
    this.reportFilterForm.controls['month'].setValue(0);
    this.reportFilterForm.controls['year'].setValue('');
    this.reportFilterForm.controls['absencePosition'].setValue(0);
  }

  GetUserTypes(): void {
    this.dataContext.get('user/getUserTypes').subscribe((data: any) => {
      this.userTypes = data;
    },
      error => <any>error);
  }

  onSubmit(formGroup: FormGroup) {
    this.submitted = true;
    if (!formGroup.invalid) {
      if (formGroup.value.reasonId != 0) {
        formGroup.get('reasonId').setValue(formGroup.value.reasonId);
      }
      if (this.componentName == "daily") {
        formGroup.get('fromDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));
        formGroup.get('toDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));
        formGroup.get('reportTitle').setValue('D');

      }
      else {
        formGroup.get('fromDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));
        formGroup.get('toDate').setValue(moment(formGroup.get('toDate').value).format('YYYY-MM-DD'));
        formGroup.get('reportTitle').setValue('M');
      }
      const action = {
        actionName: 'submit',
        formValue: formGroup.value
      };
      this.formAction.emit(action);
    }
  }

  onCancel() {
    const dialogCancel = this.dialogRef.open(PopupForCancelAbsencesComponent, {
      height: '380px',
      width: '600px',
    });
    dialogCancel.afterClosed().subscribe(result => {
      if (result != null) {
        this.reportFilterForm.controls['OrganizationId'].setValue(result.OrganizationId);
        this.reportFilterForm.controls['deleteAbsenceReason'].setValue(result.deleteAbsenceReason);
        this.reportFilterForm.controls['District'].setValue(result.District);
        this.reportService.cancelAbsences(this.reportFilterForm.value).subscribe((response: any) => {
          if (response == "success") {
            this.onSubmit(this.reportFilterForm);
            this.notifier.notify('success', 'Cancel Successfully');
          }
          else {
            this.notifier.notify('error', 'No Absence found');
          }
        });
      }
    });
  }

  onPrintReport(formGroup: FormGroup) {
    this.submitted = true;
    if (!formGroup.invalid) {
      if (formGroup.value.reasonId != 0) {
        formGroup.get('reasonId').setValue(formGroup.value.reasonId);
      }
      formGroup.get('fromDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));
      formGroup.get('toDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));
      const action = {
        actionName: 'print',
        formValue: formGroup.value
      };
      this.formAction.emit(action);
    }
  }
}
