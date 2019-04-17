import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { ReportDetail } from '../../../Model/Report/report.detail';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbsenceService } from '../../../Services/absence.service';
import { HttpErrorResponse, HttpResponse, HttpEventType, HttpClient } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { DataContext } from '../../../Services/dataContext.service';
import { UserSession } from '../../../Services/userSession.service';
import { EmployeeService } from '../../../Service/Manage/employees.service';
import { LeaveType } from '../../../Model/leaveType';
import { environment } from '../../../../environments/environment';
import { IEmployee } from '../../../Model/Manage/employee';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../../../Services/file.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'report-details',
  templateUrl: 'report-details.popup.component.html',
  styleUrls: ['report-details.popup.component.scss']
})
export class ReportDetailsComponent implements OnInit {
  SelectionFilterForAlreadyCreatedAbsences = (d: Date): boolean => {
    const day = d.getDay();
    return d.toLocaleDateString() !== "10/1/2018";
    // (day !== 0 && day !== 6) &&
}
  reportDetail: ReportDetail = new ReportDetail();
  menuAction = 'view';
  absenceForm: FormGroup;
  currentDate: Date = new Date();
  SubstituteList : any;
  EmployeeSchedule : any;
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
  AttachedFileType: string;
  AttachedFileExtention: string;
  CompletedPercentage: number;
  SuccessMessage: boolean;
  Substututes: Observable<IEmployee[]>;
  ImageURL: SafeUrl = "";
  msg: string;

  constructor(
    private absenceService: AbsenceService,
    private dialogRef: MatDialogRef<ReportDetailsComponent>,
    private _formBuilder: FormBuilder,
    private notifier: NotifierService,
    private _dataContext: DataContext,
    private _userSession: UserSession,
    private _employeeService: EmployeeService,
    private _dialog: MatDialog,
    private http: HttpClient,
    private _EmployeeService: EmployeeService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reportDetail = data;
    this.notifier = notifier;
  }

  ngOnInit() {
    this.InitializeValues();
    this.GetLeaveTypes();
    this.GetCreatedAbsencesOfEmployee(this._userSession.getUserId());
    this.GetSustitutes();

    this.absenceForm = this._formBuilder.group({
      absenceCreatedByEmployeeId:[''],
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
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  performAction(action: string){
    this.absenceForm.reset();
    this.menuAction = action;   
    if(action === 'edit') {
      this.absenceService.getById('Absence', this.reportDetail.absenceId).subscribe((data: any) => {
        console.log({absence: data});
        this.absenceForm.patchValue({...data});    
      });
      
    }
    else if(action === 'delete') {    
      let confirmResult = confirm('Are you sure you want to cancel this absence?');
      let StatusId = 4;
        if (confirmResult) {
            this._dataContext.UpdateAbsenceStatus('Absence/updateAbseceStatus', this.reportDetail.absenceId, StatusId, this.currentDate.toISOString(), this._userSession.getUserId()).subscribe((response: any) => {
              this.dialogRef.close('Reload');
              this.notifier.notify('success', 'Cancelled Successfully.');
            });
        }
    }
    else if(action === 'release')
    {
      let confirmResult = confirm('Are you sure you want to release this job?');
      let StatusId = 1;
        if (confirmResult) {         
          this._dataContext.UpdateAbsenceStatus('Absence/updateAbseceStatus', this.reportDetail.absenceId, StatusId, this.currentDate.toISOString(), this._userSession.getUserId()).subscribe((response: any) => {
            if (response == "success") {
              this.dialogRef.close('Reload');
              this.notifier.notify('success', 'Released Successfully.');                           
            }
          });
        }       
    }  
  } 
  
  onAssign(formGroup: FormGroup) {
    let confirmResult = confirm('Are you sure you want to assign this job?');
    let StatusId = 2;
      if (confirmResult) {
          this._dataContext.UpdateAbsenceStatusAndSub('Absence/updateAbseceStatusAndSub', this.reportDetail.absenceId, StatusId, this.currentDate.toISOString(), this._userSession.getUserId(), formGroup.value.substituteId.userId, this.reportDetail.substituteRequired).subscribe((response: any) => {
              if (response == "success") {
                this.dialogRef.close('Reload');
                this.notifier.notify('success', 'Assign Successfully.');                  
              }
          });
      }       
  }
 
  GetLeaveTypes(): void {
    let districtId = this._userSession.getUserDistrictId();
    let organizationId = this._userSession.getUserOrganizationId() ? this._userSession.getUserOrganizationId() : '-1';
    this.absenceService.getLeaveType(districtId, organizationId).subscribe((data: LeaveType[]) => {
        this.Leaves = data;   
    });
  }

  onChangeReason(reason: LeaveType): void {
      if (reason.isApprovalRequired)
          this.isApprovalNeeded = true;
      else
          this.isApprovalNeeded = false;
  }

  //ASYNC FUNCTION TO SEARCH SUBSTITUTE
  SearchSubstitutes(SearchedText: string) {
    let IsSearchSubstitute = 1;
    let OrgId = this._userSession.getUserOrganizationId();
    let DistrictId = this._userSession.getUserDistrictId();
    this.Substututes = this._EmployeeService.searchUser('user/getEmployeeSuggestions', SearchedText, IsSearchSubstitute, OrgId, DistrictId);
    this.Substututes = this.Substututes.map((users: any) => users.filter(user => user.userId != this._userSession.getUserId()));
  }

  //CHANGE OF SELECTED Substutute FOR WHICH WE ASSIGN ABSENCE
  substututeSelection(SubstututesDetail: any) {
    this.EmployeeNameForAbsence = SubstututesDetail.firstName;
    this.EmployeeIdForAbsence = SubstututesDetail.userId;
    this.loginedUserType = SubstututesDetail.userTypeId;
    this.AbsenceForUserLevel = SubstututesDetail.userLevel;
    if (this.AbsenceForUserLevel == 3) {
        this.absenceForm.get('OrganizationId').setValue(SubstututesDetail.organizationId);
    }
    this.GetLocationTime(this.EmployeeIdForAbsence, this.AbsenceForUserLevel);
  }

  onSubmit(formGroup: FormGroup) {
    if (!formGroup.invalid) {

      formGroup.get('startDate').setValue( new Date(formGroup.value.startDate).toLocaleDateString());
      formGroup.get('endDate').setValue( new Date(formGroup.value.endDate).toLocaleDateString());    

      if(this.AttachedFileName != null)
      {
        formGroup.get('anyAttachment').setValue(1);
        formGroup.get('attachedFileName').setValue(this.AttachedFileName);
        formGroup.get('fileExtention').setValue(this.AttachedFileExtention);
        formGroup.get('fileContentType').setValue(this.AttachedFileType);
      }

      if(formGroup.value.substituteId != -1) {
        formGroup.get('substituteId').setValue(formGroup.value.substituteId.userId);
        formGroup.get('status').setValue('2');
      }
     
      this.absenceService.Patch('/Absence/updateAbsence/',formGroup.getRawValue()).subscribe((respose: any) => {     
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
    this.GetLocationTime(this.EmployeeIdForAbsence, this.loginedUserLevel)
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
    this._employeeService.get('user/getUsers',RoleId, OrgId, DistrictId).subscribe((data: any) => {
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
  }

  uploadAndProgress(files: File[]) {
      this.AllAttachedFiles = files;
      this.AttachedFileType = files[0].type;
      this.FileName = this.AllAttachedFiles[0].name;
      this.AttachedFileExtention = files[0].name.split('.')[1];
      let formData = new FormData();
      Array.from(files).forEach(file => formData.append('file', file))
      this.http.post(environment.apiUrl + 'Absence/uploadFile', formData)
          .subscribe(event =>{
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

  getProfilePic(ProfilePictureName: string): SafeUrl {
    this.ImageURL = 'assets/Images/noimage.png'
    let model = {
        AttachedFileName: ProfilePictureName,
        FileContentType: ProfilePictureName.split('.')[1],
    }
    this.fileService.getProfilePic(model).subscribe((blob: Blob) => {
        let newBlob = new Blob([blob]);
        var file = new Blob([blob], { type: blob.type });
        let Url = URL.createObjectURL(file);
        this.ImageURL = this.sanitizer.bypassSecurityTrustUrl(Url);
        return this.ImageURL;
    },
        error => this.msg = <any>error);
    return this.ImageURL;
  }

  displayName(user?: any): string | undefined {
    return user ? user.firstName : undefined;
  }

}
