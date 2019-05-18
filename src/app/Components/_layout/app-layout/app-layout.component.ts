import { Component, OnInit, HostBinding, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Service/user.service';
import { SideNavService } from '../../SideNav/sideNav.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AbsenceService } from 'src/app/Services/absence.service';
import { UserSession } from 'src/app/Services/userSession.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  @HostBinding('class.is-open')
  userTemplate: any;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  UserClaim: any;
  msg: string;
  UserName: string;
  isOpen = true;

  constructor(private router: Router, private _userService: UserService, private sideNavService: SideNavService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private absenceService: AbsenceService,
    private userSession: UserSession) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.loadUserResources();
  }

  loadUserResources(): void {
    const resourceTypeId = 2;
    const parentResourceTypeId = -1;
    const adminPortal = 0;
    this._userService.getUserResources(resourceTypeId, parentResourceTypeId, adminPortal).subscribe((data: any) => {
      this.userTemplate = data;
    },
      error => this.msg = <any>error);
  }
}