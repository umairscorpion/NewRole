import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatExpansionPanel, MatDatepickerInputEvent } from '@angular/material';
import { DataContext } from '../../../Services/dataContext.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportFilter } from '../../../Model/Report/report.filter';
import * as moment from 'moment';

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
  leaveReasons: any;
  reportFilterForm: FormGroup;
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private dataContext: DataContext
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

    this.dataContext.get('Leave/GetLeaveTypes').subscribe((data: any) => {
      this.leaveReasons = data;
    },
      error => <any>error);
  }

  onSubmit(formGroup: FormGroup) {
    this.submitted = true;
    if (!formGroup.invalid) {
      formGroup.get('fromDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));
      formGroup.get('toDate').setValue(moment(formGroup.get('fromDate').value).format('YYYY-MM-DD'));
      const action = {
        actionName: 'submit',
        formValue: formGroup.value
      };
      this.formAction.emit(action);
    }
  }
}
