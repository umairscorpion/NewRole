import { Component, OnInit, Inject } from '@angular/core';
import { FileManager } from 'src/app/Model/FileSystem/fileManager.detail';
import { DataContext } from 'src/app/Services/dataContext.service';
import { FileService } from 'src/app/Services/file.service';
import { SafeUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AvailableJobsComponent } from 'src/app/Components/Job/SubPages/AvailableJobs/availableJobs.component';

@Component({
  selector: 'app-show-school-files-popup',
  templateUrl: './show-school-files-popup.component.html',
  styleUrls: ['./show-school-files-popup.component.css']
})
export class ShowSchoolFilesPopupComponent implements OnInit {

  AllAttachedFiles: any;
  FileName: string;
  OriginalFileName: string;
  FileContentType: string;
  FileExtention: string;
  Files: any;
  OriginalFileNameForDisplay: any;
  attachFileUrl: SafeUrl = "";
  msg: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AvailableJobsComponent>,
    private _dataContext: DataContext) { }

  ngOnInit() { }

  ViewFile(fileData: any) {
    const model = { FileName: fileData.fileName, FileContentType: fileData.fileContentType };
    this._dataContext.getFile('fileSystem/getUploadFile', model).subscribe((blob: any) => {
      const newBlob = new Blob([blob]);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      if (fileData.fileContentType == "text/plain") {
        // To open in browser
        const files = new Blob([blob], { type: fileData.fileContentType });
        window.open(URL.createObjectURL(files));
      }
      else {
        let data = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = data;
        link.download = fileData.fileName;
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
        }, 100);
      }
    },
      error => this.msg = <any>error);
  }

  DownloadFile(fileData: any): void {
    const model = { FileName: fileData.fileName, FileContentType: fileData.fileContentType };
    this._dataContext.getFile('fileSystem/getUploadFile', model).subscribe((blob: any) => {
      const newBlob = new Blob([blob]);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      // To Download
      let data = window.URL.createObjectURL(newBlob);
      let link = document.createElement('a');
      link.href = data;
      link.download = fileData.fileName;
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
      }, 100);
    });
  }


  onClose() {
    this.dialogRef.close();
  }
}
