import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DataContext } from '../../../../Services/dataContext.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { UserSession } from '../../../../Services/userSession.service';

@Component({
  templateUrl: 'importStaff.component.html',
  styleUrls: ['importStaff.component.scss']
})
export class ImportStaffComponent implements OnInit {
  @ViewChild('fileInput') fileInput;  
  private notifier: NotifierService;
  displayedColumns = ['Index', 'FName', 'LName', 'Role', 'Location','Grade', 'Subject', 'Email', 'Phone', 'Level','Status'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  msg: string;
  Districts: any;
  UserRole: number = this._userSession.getUserRoleId();
  DistrictId: any = 0;
  
  constructor(
    private router: Router,
    private _dataContext: DataContext,
    public dialog: MatDialog,
    notifier: NotifierService,
    private _userSession: UserSession,) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    this.GetDistricts();
    //this.GetTemporaryStaff();
    this.DeleteTemporaryStaff();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  GetDistricts(): void{
    this._dataContext.get('district/getDistricts').subscribe((data: any) => {
      this.Districts = data;
  },
      error => <any>error);
  }
  GetTemporaryStaff(): void {
    this._dataContext.get('user/getTemporaryStaff').subscribe((data: any) => {
    this.dataSource.data = data;
    },
      error => this.msg = <any>error);
  }

  onChangeDistrict(districtId: any) {
      this.DistrictId = districtId;
  }

  DeleteTemporaryStaff(): void {
    this._dataContext.get('user/deleteTemporaryStaff').subscribe((data: any) => {
    },
      error => this.msg = <any>error);
  }


  VerifyData() {  
    if (this.DistrictId == 0) {
      this.DistrictId = this._userSession.UserClaim.districtId;
      if (this.DistrictId == 0) {
        this.notifier.notify('error', 'Please Select District First.');
        return;
      }
    } 
    if(this.fileInput.nativeElement.files[0] == null){
      this.notifier.notify('error', 'Please Select File First.');
      return;
    }
    let formData = new FormData();  
    formData.append('upload', this.fileInput.nativeElement.files[0]);
    this._dataContext.VerifyStaffData(formData, this.DistrictId).subscribe(result => {  
      if(result == 3){
        this.notifier.notify('success', 'Data Uploaded Successfully. Please Verify Your Data.');
        this.GetTemporaryStaff();
      }
      else if(result == 2){
        this.notifier.notify('error', 'File is Empty.');
      }
      else if(result == 1){
        this.notifier.notify('error', 'We are Sorry, This file format is not supported. Only Excel files are allowed.');
      }
      else{
        this.notifier.notify('error', 'We are Sorry, Something Went Wrong.');
      }
    });   
  }
    uploadFile() {  
      if (this.DistrictId == 0) {
        this.DistrictId = this._userSession.UserClaim.districtId;
        if (this.DistrictId == 0) {
          this.notifier.notify('error', 'Please Select District First.');
          return;
        }
      } 
      if(this.fileInput.nativeElement.files[0] == null){
        this.notifier.notify('error', 'Please Select File First.');
        return;
      }
      let formData = new FormData();  
      formData.append('upload', this.fileInput.nativeElement.files[0]);
      this._dataContext.ImportStaff(formData, this.DistrictId).subscribe((result: any) => {  
        if(result == 3){
          this.notifier.notify('success', 'Staff Imported Successfully.');
        }
        else if(result == 2){
          this.notifier.notify('error', 'File is Empty.');
        }
        else if(result == 1){
          this.notifier.notify('error', 'We are Sorry, This file format is not supported. Only Excel files are allowed.');
        }
        else if (result == '')
      {
        this.notifier.notify('error', 'We are Sorry something went wrong.');
      }
        else{
          this.notifier.notify('error', result);
        }
      });   
    
    } 
  }  