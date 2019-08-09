import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-show-announcement-popup',
  templateUrl: './show-announcement-popup.component.html',
  styleUrls: ['./show-announcement-popup.component.css']
})
export class ShowAnnouncementPopupComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public Announcements: any) { }

  ngOnInit() {
  }

}
