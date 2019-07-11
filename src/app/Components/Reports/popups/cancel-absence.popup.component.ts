import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatExpansionPanel, MatDialogRef } from '@angular/material';
import { DataContext } from '../../../Services/dataContext.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportFilter } from '../../../Model/Report/report.filter';
import { UserSession } from '../../../Services/userSession.service';
import { AbsenceService } from '../../../Services/absence.service';
import { LeaveType } from '../../../Model/leaveType';
import { ReportDetailsComponent } from './report-details.popup.component';

@Component({
  selector: 'app-popup-for-cancel-absences',
  templateUrl: 'cancel-absence.popup.component.html'
})
export class PopupForCancelAbsencesComponent implements OnInit {

  @ViewChild('myPanel') myPanel: MatExpansionPanel;
  @Output() formActions = new EventEmitter();

  matIcon = 'keyboard_arrow_down' || 'keyboard_arrow_up';
  districts: any;
  organizations: any;
  reportFilterForm: FormGroup;
  cancelAbsenceForm: FormGroup;
  Leaves: any;
  loginedUserRole: any;
  organizationId: any;
  districtId: any;
  schoolInformation: any;
  Districts: any;
  Organizations: any;
  submitted = false;
  
  constructor(
    private fb: FormBuilder,
    private dataContext: DataContext,
    private _userSession: UserSession,
    private absenceService: AbsenceService,
    private _dialogRef: MatDialogRef<ReportDetailsComponent>,
    private _formBuilder: FormBuilder) {
    this.reportFilterForm = this.initReportFilters();
  }

  ngOnInit() {
    this.loadData();
    this.loginedUserRole = this._userSession.getUserRoleId();
    this.GetDistricts();
    this.GetOrganiations();
    this.cancelAbsenceForm = this._formBuilder.group({
      OrganizationId: ['', Validators.required],
      deleteAbsenceReason: [''],
      District: ['', Validators.required]
    });
  }

  initReportFilters() {
    return ReportFilter.CreateFilterFormGroup(this.fb);
  }

  loadData() {
    this.dataContext.get('district/getDistricts').subscribe((data: any) => {
      this.districts = data;
    },
      error => <any>error);

    this.districtId = this._userSession.getUserDistrictId();
    this.organizationId = this._userSession.getUserOrganizationId() ? this._userSession.getUserOrganizationId() : '-1';
    this.absenceService.getLeaveType(this.districtId, this.organizationId).subscribe((data: LeaveType[]) => {
      this.Leaves = data;
    },
      error => <any>error);
  }

  getOrganizationById(districtid: any) {
    this.districtId = districtid;
    this.organizationId = districtid;
    this.dataContext.getById('School/getOrganizationsByDistrictId', this.districtId).subscribe((data) => {
      this.organizations = data;
    });

    this.dataContext.getById('School/getSchoolById', this.organizationId).subscribe((data: any) => {
      this.schoolInformation = data;
    });
  }

  GetDistricts(): void {
    this.dataContext.get('district/getDistricts').subscribe((data: any) => {
      this.Districts = data;
      this.cancelAbsenceForm.get('District').setValue(this._userSession.getUserDistrictId());
    },
      error => <any>error);
  }

  GetOrganiations(): void {
    this.dataContext.get('school/getSchools').subscribe((data: any) => {
      this.Organizations = data;
      if (this._userSession.getUserRoleId() == 2) {
        this.cancelAbsenceForm.get('OrganizationId').setValue(this._userSession.getUserOrganizationId());
        this.cancelAbsenceForm.controls['OrganizationId'].disable();
      }
    });
  }
  
  onCloseDialog() {
    this._dialogRef.close();
  }

  onSubmit(formGroup: FormGroup) {
    if (!formGroup.invalid) {
      this._dialogRef.close(formGroup.getRawValue());
    }
  }
}


