import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProfileComponent } from '../../Components/Manage/SubPages/Profile/profile.component';
import { DataContext } from '../../Services/dataContext.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show-attachment-popup',
  templateUrl: './show-attachment-popup.component.html',
  styleUrls: ['./show-attachment-popup.component.css']
})
export class ShowAttachmentPopupComponent implements OnInit {

  attachFileUrl: SafeUrl = "";
  msg: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProfileComponent>,
    private _dataContext: DataContext,
    private sanitizer: DomSanitizer) {
    this.viewAttachmet();
  }

  ngOnInit() {
  }

  viewAttachmet() {
    const model = { FileName: this.data.fileName, FileContentType: this.data.fileContentType };
    this._dataContext.getFile('fileSystem/getUploadFile', model).subscribe((blob: any) => {
      const newBlob = new Blob([blob]);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      const file = new Blob([blob], { type: blob.type });
      const Url = URL.createObjectURL(file);
      this.attachFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(Url);
    },
      error => this.msg = <any>error);
  }

  onClose() {
    this.dialogRef.close();
  }
}
