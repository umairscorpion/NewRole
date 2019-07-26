import { Component, OnInit } from '@angular/core';
import { ShowAttachmentPopupComponent } from '../../Shared/show-attachment-popup/show-attachment-popup.component';
import { environment } from '../../../environments/environment';
import { DataContext } from '../../Services/dataContext.service';
import { UserSession } from '../../Services/userSession.service';
import { FileService } from '../../Services/file.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { FileManager } from '../../Model/FileSystem/fileManager.detail';
import { NotifierService } from 'angular-notifier';
import swal from 'sweetalert2';

@Component({
  selector: 'app-school-files',
  templateUrl: './school-files.component.html',
  styleUrls: ['./school-files.component.css']
})
export class SchoolFilesComponent implements OnInit {
  LoginedUserId: any = 0;
  UserRoleId: number = this._userSession.getUserRoleId();
  UserLevelId: number = this._userSession.getUserLevelId();
  AllAttachedFiles: any;
  FileName: string;
  OriginalFileName: string;
  FileContentType: string;
  FileExtention: string;
  SuccessMessage: boolean;
  Files: any;
  msg: string;
  OriginalFileNameForDisplay: any;
  AdminGuide: FileManager[];
  StaffGuide: FileManager[];
  SubstituteGuide: FileManager[];

  constructor(
    private _dataContext: DataContext,
    private _userSession: UserSession,
    private _fileService: FileService,
    private http: HttpClient,
    private dialogRef: MatDialog,
    private notifier: NotifierService) { }

  ngOnInit() {
    this.getFiles();
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
    this.OriginalFileName = null;
    this.OriginalFileNameForDisplay = null;
  }

  uploadAndProgress(files: File[]) {
    this.AllAttachedFiles = files;
    this.FileContentType = files[0].type;
    if (!this.FileContentType) this.FileContentType = "text/plain";
    this.OriginalFileName = this.AllAttachedFiles[0].name;
    this.OriginalFileNameForDisplay = this.OriginalFileName.substr(0, 15);
    this.FileExtention = files[0].name.split('.')[1];
    let formData = new FormData();
    Array.from(files).forEach(file => formData.append('file', file))
    this.http.post(environment.apiUrl + 'fileSystem/uploadFile', formData).subscribe(event => {
      this.SuccessMessage = true;
      this.FileName = event.toString();
    });
  }

  getFiles(): void {
    let model = {
      fileType: "School Files"
    }
    this._fileService.getFile(model).subscribe((respose: FileManager[]) => {
      this.Files = respose;
    });
  }

  AddFile() {
    if (this.OriginalFileName == null) {
      this.notifier.notify('error', 'Please upload file.');
      return;
    }
    let model = {
      originalFileName: this.OriginalFileName,
      fileName: this.FileName,
      fileContentType: this.FileContentType,
      fileExtention: this.FileExtention,
      fileType: 6
    }
    this._fileService.addFile('fileSystem/addFiles', model).subscribe((respose: any) => {
      this.Files = respose;
      this.removeAttachedFile();
    });
  }

  DeleteFile(file: any) {
    let model = {
      fileName: file.fileName,
      fileContentType: file.fileContentType,
      fileExtention: file.fileExtention,
      fileType: "Guides"
    }
    swal.fire({
      title: 'Delete',
      text:
        'Are you sure, you want to delete the selected File?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-danger',
      cancelButtonClass: 'btn btn-success',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then(r => {
      if (r.value) {
        this._fileService.deleteFile('fileSystem/deleteFiles', model).subscribe((respose: any) => {
          this.Files = respose;
          this.AdminGuide = respose.filter(t => t.fileType == 2);
          this.StaffGuide = respose.filter(t => t.fileType == 3);
          this.SubstituteGuide = respose.filter(t => t.fileType == 4);
          this.notifier.notify('success', 'Deleted Successfully.');
        },
          error => this.msg = <any>error);
      }
    });
  }

  ViewFile(fileData: any) {
    this.dialogRef.open(
      ShowAttachmentPopupComponent, {
        panelClass: 'app-show-attachment-popup',
        data: fileData
      }
    );
  }

  DownloadFile(file: any): void {
    const model = { FileName: file.fileName, FileContentType: file.fileContentType };
    this._dataContext.getFile('fileSystem/getUploadFile', model).subscribe((blob: any) => {
      const newBlob = new Blob([blob]);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      // To open in browser
      // const files = new Blob([blob], { type: file.attachedFileId });
      // window.open(URL.createObjectURL(files));   
      // To Download
      let data = window.URL.createObjectURL(newBlob);
      let link = document.createElement('a');
      link.href = data;
      link.download = file.fileName;
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
      }, 100);
    });
  }
}
