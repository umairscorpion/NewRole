import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit {
  versionUpdates: any;

  constructor(
    private dialogRef: MatDialogRef<SplashScreenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.versionUpdates = data;
  }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }
}
