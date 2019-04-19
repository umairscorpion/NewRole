import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatExpansionPanel, MatDatepickerInputEvent } from '@angular/material';
import { DataContext } from 'src/app/Services/dataContext.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportFilter } from 'src/app/Model/Report/report.filter';
import * as moment from 'moment';
import { UserSession } from 'src/app/Services/userSession.service';
import { AbsenceService } from 'src/app/Services/absence.service';
import { LeaveType } from 'src/app/Model/leaveType';

@Component({
  selector: 'app-report-filters',
  templateUrl: 'filters.component.html',
  styleUrls: ['filters.component.scss']
})
export class ReportFiltersComponent implements OnInit {
  @ViewChild('myPanel') myPanel: MatExpansionPanel;
  @Output() formAction = new EventEmitter();

  matIcon = 'keyboard_arrow_down' || 'keyboard_arrow_up';
  districts: any;
  reportFilterForm: FormGroup;
  Leaves: any;

  submitted = false;
  constructor(
    private fb: FormBuilder,
    private dataContext: DataContext,
    private _userSession: UserSession,
    private absenceService: AbsenceService
  ) {
    this.reportFilterForm = this.initReportFilters();
  }

  ngOnInit() {
    this.myPanel.expandedChange.subscribe((data) => {
      this.matIcon = data ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    });
    this.loadData();
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
    this.reportFilterForm.controls['employeeTypeId'].setValue(0);
    this.reportFilterForm.controls['absenceTypeId'].setValue(0);
    this.reportFilterForm.controls['locationId'].setValue(0);
    this.reportFilterForm.controls['districtId'].setValue(0);
    this.reportFilterForm.controls['reasonId'].setValue(0);
    this.reportFilterForm.controls['employeeName'].setValue('');
  }

  onSubmit(formGroup: FormGroup) {
    this.submitted = true;
    if (!formGroup.invalid) {  
      if(formGroup.value.reasonId != 0){  
        formGroup.get('reasonId').setValue(formGroup.value.reasonId);  
      }       
      formGroup.get('fromDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));
      formGroup.get('toDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));    
      const action = {
        actionName: 'submit',
        formValue: formGroup.value
      };
      this.formAction.emit(action);
    }
  }

  onCancel(formGroup: FormGroup) {
    this.submitted = true;
    if (!formGroup.invalid) {  
      if(formGroup.value.reasonId != 0){  
        formGroup.get('reasonId').setValue(formGroup.value.reasonId);  
      }       
      formGroup.get('fromDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));
      formGroup.get('toDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));    
      const action = {
        actionName: 'cancel',
        formValue: formGroup.value
      };
      this.formAction.emit(action);
    }
  }
}
