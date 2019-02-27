import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material';
import { DataContext } from 'src/app/Services/dataContext.service';

@Component({
  selector: 'app-report-filters',
  templateUrl: 'filters.component.html',
  styleUrls: ['filters.component.scss']
})
export class ReportFiltersComponent implements OnInit {
  @ViewChild('myPanel') myPanel: MatExpansionPanel;
  matIcon = 'keyboard_arrow_down' || 'keyboard_arrow_up';
  districts: any;
  leaveReasons: any;


  constructor(
    private dataContext: DataContext
  ) {

  }

  ngOnInit() {
    this.myPanel.expandedChange.subscribe((data) => {
      this.matIcon = data ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    });
    this.loadData();
  }

  expandPannel() {
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
}
