import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReportDetail } from '../../../Model/Report/report.detail';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbsenceService } from '../../../Services/absence.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { DataContext } from '../../../Services/dataContext.service';
import { UserSession } from '../../../Services/userSession.service';
import { EmployeeService } from '../../../Service/Manage/employees.service';
import { LeaveType } from '../../../Model/leaveType';
import { environment } from '../../../../environments/environment';
import { IEmployee } from '../../../Model/Manage/employee';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { User } from 'src/app/Model/user';
import swal from 'sweetalert2';

@Component({
  selector: 'report-details',
  templateUrl: 'report-details.popup.component.html',
  styleUrls: ['report-details.popup.component.scss']
})
export class ReportDetailsComponent implements OnInit {
  reportDetail: ReportDetail = new ReportDetail();
  menuAction = 'view';
  absenceForm: FormGroup;
  currentDate: Date = new Date();
  SubstituteList: any;
  EmployeeSchedule: any;
  loginedUserLocationTime: any = null;
  loginedUserLevel: number = 0;
  AbsenceForUserLevel: number = 0;
  loginedUserRole: number = 0;
  loginedUserType: number = 0;
  EmployeeIdForAbsence: string;
  EmployeeNameForAbsence: string;
  Leaves: any;
  isApprovalNeeded: boolean = false;
  AllAttachedFiles: any;
  AttachedFileName: string;
  FileName: string;
  OriginalFileNameForDisplay: string;
  AttachedFileType: string;
  AttachedFileExtention: string;
  SuccessMessage: boolean;
  Substututes: Observable<IEmployee[]>;
  msg: string;
  //Available Substitutes
  availableSubstitutes: Observable<User[]>;

  constructor(
    private absenceService: AbsenceService,
    private dialogRef: MatDialogRef<ReportDetailsComponent>,
    private _formBuilder: FormBuilder,
    private notifier: NotifierService,
    private _dataContext: DataContext,
    private _userSession: UserSession,
    private _employeeService: EmployeeService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.reportDetail = data;
    if (this.reportDetail.originalFileName) {
      this.reportDetail.originalFileName = this.reportDetail.originalFileName.substr(0, 15);
    }
    this.notifier = notifier;
  }

  ngOnInit() {
    this.InitializeValues();
    this.GetLeaveTypes();
    this.GetCreatedAbsencesOfEmployee(this._userSession.getUserId());
    this.GetSustitutes();
    this.absenceForm = this._formBuilder.group({
      absenceCreatedByEmployeeId: [''],
      absenceId: [''],
      absenceLocation: [''],
      absenceReasonDescription: [''],
      absenceReasonId: [''],
      absenceScope: [''],
      absenceStatusDescription: [''],
      acceptedDate: [''],
      anyAttachment: [''],
      anyConflict: [''],
      approvedDate: [''],
      attachedFileName: [''],
      createdByUser: [''],
      createdDate: [''],
      districtAddress: [''],
      districtId: [''],
      durationType: [''],
      absenceType: [''],
      employeeId: [''],
      employeeName: [''],
      endDate: [''],
      endTime: [{ value: '', disabled: true }],
      fileContentType: [''],
      fileExtention: [''],
      grade: [''],
      interval: [''],
      isApprovalRequired: [''],
      organizationAddress: [''],
      organizationId: [''],
      organizationName: [''],
      payrollNotes: [''],
      positionDescription: [''],
      positionId: [''],
      profilePicture: [''],
      startDate: [''],
      startTime: [{ value: '', disabled: true }],
      status: [''],
      subjectDescription: [''],
      substituteId: ['', Validators.required],
      substituteName: [''],
      substituteNotes: [''],
      substituteRequired: [''],
      totalInterval: [''],
      originalFileName: [''],
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  performAction(action: string) {
    this.absenceForm.reset();
    this.menuAction = action;
    if (action === 'edit') {
      this.absenceService.getById('Absence', this.reportDetail.absenceId).subscribe((data: any) => {
        this.onChangeDurationForAbsence(data.durationType);
        this.absenceForm.patchValue({ ...data });
      });
    }
    else if (action === 'delete') {
      let StatusId = 4;
      let absenceStartDate = moment(this.reportDetail.startDate).format('MM/DD/YYYY');
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
          // if (absenceStartDate <= currentDate) {
          //   this.dialogRef.close();
          //   this.notifier.notify('error', 'Not able to cancel now.');
          //   return;
          // }
          this._dataContext.UpdateAbsenceStatus('Absence/updateAbseceStatus', this.reportDetail.absenceId, StatusId, this.currentDate.toISOString(), this._userSession.getUserId()).subscribe((response: any) => {
            this.dialogRef.close('Reload');
            this.notifier.notify('success', 'Cancelled Successfully.');
          });

        }
      });
    }
    else if (action === 'release') {
      let StatusId = 1;
      let absenceStartDate = moment(this.reportDetail.startDate).format('MM/DD/YYYY');
      let currentDate = moment(this.currentDate).format('MM/DD/YYYY');

      swal.fire({
        title: 'Release',
        text:
          'Are you sure you want to release this job?',
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
            this.dialogRef.close();
            this.notifier.notify('error', 'Not able to release now');
            return;
          }
          this._dataContext.UpdateAbsenceStatus('Absence/updateAbseceStatus', this.reportDetail.absenceId, StatusId, this.currentDate.toISOString(), this._userSession.getUserId()).subscribe((response: any) => {
            if (response == "success") {
              this.dialogRef.close('Reload');
              this.notifier.notify('success', 'Released Successfully.');
            }
          });
        }
      });
    }
  }

  onAssign(formGroup: FormGroup) {
    let StatusId = 2;
    swal.fire({
      title: 'Assign',
      text:
        'Are you sure you want to assign this job?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-danger',
      cancelButtonClass: 'btn btn-success',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then(r => {
      if (r.value) {
        this._dataContext.UpdateAbsenceStatusAndSub('Absence/updateAbseceStatusAndSub', this.reportDetail.absenceId, StatusId, this.currentDate.toISOString(), this._userSession.getUserId(), formGroup.value.substituteId.userId, this.reportDetail.substituteRequired).subscribe((response: any) => {
          if (response == "success") {
            this.dialogRef.close('Reload');
            this.notifier.notify('success', 'Assign Successfully.');
          }
        },
          error => this.msg = <any>error);
      }
    });
  }

  GetLeaveTypes(): void {
    let districtId = this._userSession.getUserDistrictId();
    let organizationId = this._userSession.getUserOrganizationId() ? this._userSession.getUserOrganizationId() : '-1';
    this.absenceService.getLeaveType(districtId, organizationId).subscribe((data: LeaveType[]) => {
      this.Leaves = data;
    });
  }

  //Search Available Substitutes
  SearchAvailableSubstitutes(SearchedText: string): void {
    if (this.reportDetail.startDate && this.reportDetail.endDate) {
      let filter = {
        districtId: this._userSession.getUserDistrictId(),
        employeeId: this.EmployeeIdForAbsence,
        startDate: moment(this.reportDetail.startDate).format('MM/DD/YYYY'),
        endDate: moment(this.reportDetail.endDate).format('MM/DD/YYYY'),
        startTime: this.reportDetail.startTime,
        endTime: this.reportDetail.endTime
      }
      this.availableSubstitutes = this.http.post<User[]>(environment.apiUrl + 'user/getAvailableSubstitutes', filter);
      this.availableSubstitutes = this.availableSubstitutes.map((users: any) => users.filter((val: User) => val.firstName.toLowerCase().includes(SearchedText.toLowerCase())));
    }

    else {
      this.notifier.notify('error', 'Select Date First to search substitutes');
    }
  }

  //CHANGE OF SELECTED Substutute FOR WHICH WE ASSIGN ABSENCE
  substututeSelection(SubstututesDetail: any) {
    if (!SubstututesDetail.isActive) {
      this.notifier.notify('error', 'Inactive Substitute');
      return;
    }
    this.EmployeeNameForAbsence = SubstututesDetail.firstName;
    this.EmployeeIdForAbsence = SubstututesDetail.userId;
    this.loginedUserType = SubstututesDetail.userTypeId;
    this.AbsenceForUserLevel = SubstututesDetail.userLevel;
    if (this.AbsenceForUserLevel == 3) {
      this.absenceForm.get('OrganizationId').setValue(SubstututesDetail.organizationId);
    }
    this.GetLocationTime(this.EmployeeIdForAbsence, this.AbsenceForUserLevel);
    this.availableSubstitutes = null;
  }

  onSubmit(formGroup: FormGroup) {
    if (!formGroup.invalid) {
      if (this.AttachedFileName != null) {
        formGroup.get('anyAttachment').setValue(1);
        formGroup.get('attachedFileName').setValue(this.AttachedFileName);
        formGroup.get('fileExtention').setValue(this.AttachedFileExtention);
        formGroup.get('fileContentType').setValue(this.AttachedFileType);
        formGroup.get('originalFileName').setValue(this.FileName);
      }
      if (formGroup.value.substituteId && formGroup.value.substituteId.length >= 10) {
        if (formGroup.value.status == 2) {
          formGroup.get('substituteId').setValue(formGroup.value.substituteId);
        }
        else {
          formGroup.get('substituteId').setValue(formGroup.value.substituteId.userId);
        }
        formGroup.get('status').setValue('2');
        formGroup.get('substituteRequired').setValue(1);
      }
      let AbsenceModel = {
        employeeId: formGroup.value.employeeId,
        absenceId: formGroup.value.absenceId,
        startDate: new Date(formGroup.value.startDate).toLocaleDateString(),
        endDate: new Date(formGroup.value.endDate).toLocaleDateString(),
        startTime: formGroup.getRawValue().startTime,
        endTime: formGroup.getRawValue().endTime,
        absenceReasonId: formGroup.value.absenceReasonId,
        durationType: formGroup.value.durationType,
        status: formGroup.value.status,
        substituteRequired: formGroup.value.substituteRequired,
        absenceScope: formGroup.value.absenceScope,
        payrollNotes: formGroup.value.payrollNotes,
        substituteNotes: formGroup.value.substituteNotes,
        anyAttachment: formGroup.value.anyAttachment,
        attachedFileName: formGroup.value.attachedFileName,
        originalFileName: formGroup.value.originalFileName,
        fileContentType: formGroup.value.fileContentType,
        fileExtention: formGroup.value.fileExtention,
        substituteId: formGroup.value.substituteId,
        absenceType: formGroup.value.absenceType
      }
      this.absenceService.Patch('/Absence/updateAbsence/', AbsenceModel).subscribe((respose: any) => {
        if (respose == "success") {
          this.dialogRef.close('Reload');
          this.notifier.notify('success', 'Updated Successfully');
        }
        else {
          this.notifier.notify('error', 'Absence overlapping please select different date or time.');
        }
      });
    }
  }

  InitializeValues(): void {
    this.EmployeeNameForAbsence = this._userSession.getUserName();
    this.EmployeeIdForAbsence = this._userSession.getUserId();
    this.loginedUserLevel = this._userSession.getUserLevelId();
    this.loginedUserRole = this._userSession.getUserRoleId();
    this.loginedUserType = this._userSession.getUserTypeId();
    this.AbsenceForUserLevel = this.loginedUserLevel;
    this.GetLocationTime(this.EmployeeIdForAbsence, this.loginedUserLevel);
  }

  //Get Location Time For User
  GetLocationTime(userId: string, userLevel: number): void {
    this._dataContext.getUserLocationTime('user/getUserLocationTime', this.EmployeeIdForAbsence, userLevel).subscribe((data: any) => {
      this.loginedUserLocationTime = data;
      if (data) {
        this.absenceForm.controls['startTime'].setValue(this.loginedUserLocationTime.startTime);
        this.absenceForm.controls['endTime'].setValue(this.loginedUserLocationTime.endTime);
      }
    },
      (err: HttpErrorResponse) => {

      });
  }

  onChangeDurationForAbsence(durationType: any) {
    this.absenceForm.controls['startTime'].clearValidators();
    this.absenceForm.controls['endTime'].clearValidators();
    this.absenceForm.controls['startTime'].updateValueAndValidity();
    this.absenceForm.controls['endTime'].updateValueAndValidity();

    this.absenceForm.controls['startTime'].disable();
    this.absenceForm.controls['endTime'].disable();

    this.absenceForm.controls["startTime"].setValidators([Validators.required]);
    this.absenceForm.controls['startTime'].updateValueAndValidity();
    this.absenceForm.controls["endTime"].setValidators([Validators.required]);
    this.absenceForm.controls['endTime'].updateValueAndValidity();
    if (durationType === 1) {
      this.absenceForm.controls['startTime'].setValue(this.loginedUserLocationTime.startTime);
      this.absenceForm.controls['endTime'].setValue(this.loginedUserLocationTime.endTime);
    }

    else if (durationType === 2) {
      this.absenceForm.controls['startTime'].setValue(this.loginedUserLocationTime.startTime);
      this.absenceForm.controls['endTime'].setValue(this.loginedUserLocationTime.firstHalfEnd);
    }

    else if (durationType === 3) {
      this.absenceForm.controls['startTime'].setValue(this.loginedUserLocationTime.secondHalfStart);
      this.absenceForm.controls['endTime'].setValue(this.loginedUserLocationTime.endTime);
    }

    else if (durationType === 4) {
      this.absenceForm.controls['startTime'].enable();
      this.absenceForm.controls['endTime'].enable();
    }
  }

  GetSustitutes(): void {
    let RoleId = 4;
    let OrgId = -1;
    let DistrictId = this._userSession.getUserDistrictId();
    this._employeeService.get('user/getUsers', RoleId, OrgId, DistrictId).subscribe((data: any) => {
      this.SubstituteList = data;
    });
  }

  //For Selecting End Date Automatically
  SetEndDateValue(startDate: Date, endDate: Date) {
    this.absenceForm.get('endDate').setValue(startDate);
  }

  GetCreatedAbsencesOfEmployee(employeeId: string) {
    let StartDate = new Date();
    StartDate.setMonth(this.currentDate.getMonth() - 6)
    let EndDate = new Date();
    EndDate.setMonth(this.currentDate.getMonth() + 6)
    this._dataContext.get('Absence/getAbsencesScheduleEmployee/' + StartDate.toISOString() + "/" + EndDate.toISOString()
      + "/" + employeeId).subscribe((data: any) => {
        this.EmployeeSchedule = data;
      });
  }

  //UPLOAD ATTACHEMNT
  uploadClick() {
    const fileUpload = document.getElementById('UploadButton') as HTMLInputElement;
    fileUpload.click();
  }

  upload(files: File[]) {
    this.uploadAndProgress(files);
  }

  removeAttachedFile() {
    this.AllAttachedFiles = null;
    this.FileName = null;
    this.OriginalFileNameForDisplay = null;
  }

  uploadAndProgress(files: File[]) {
    this.AllAttachedFiles = files;
    this.AttachedFileType = files[0].type;
    if (!this.AttachedFileType) this.AttachedFileType = "text/plain";
    this.FileName = this.AllAttachedFiles[0].name;
    this.OriginalFileNameForDisplay = this.FileName.substr(0, 15);
    this.AttachedFileExtention = files[0].name.split('.')[1];
    let formData = new FormData();
    Array.from(files).forEach(file => formData.append('file', file))
    this.http.post(environment.apiUrl + 'Absence/uploadFile', formData)
      .subscribe(event => {
        this.SuccessMessage = true;
        this.AttachedFileName = event.toString();
      });
  }

  DownloadFile(): void {
    const model = { AttachedFileName: this.reportDetail.attachedFileName, FileContentType: this.reportDetail.fileContentType };
    this._dataContext.getFile('Absence/getfile', model).subscribe((blob: any) => {
      const newBlob = new Blob([blob]);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      // To open in browser
      //const file = new Blob([blob], { type: this.data.fileContentType });
      //window.open(URL.createObjectURL(file));   
      // To Download
      let data = window.URL.createObjectURL(newBlob);
      let link = document.createElement('a');
      link.href = data;
      link.download = this.data.attachedFileName;
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
      }, 100);
    });
  }

  getImage(imageName: string) {
    if (imageName && imageName.length > 0) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(environment.profileImageUrl + imageName);
    }
  }

  displayName(user?: any): string | undefined {
    return user ? user.firstName : undefined;
  }
}
