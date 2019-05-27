import { Component, OnInit, ChangeDetectorRef, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../Service/user.service';
import { SideNavService } from '../../SideNav/sideNav.service';
import { AbsenceService } from '../../../Services/absence.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserSession } from '../../../Services/userSession.service';

@Component({
  selector: 'site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css']
})
export class SiteHeaderComponent implements OnInit {


  constructor() { }

  ngOnInit() {

  }


}