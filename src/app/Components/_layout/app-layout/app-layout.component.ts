import { Component, OnInit, HostBinding, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { UserService } from '../../../Service/user.service';
import { SideNavService } from '../../SideNav/sideNav.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AbsenceService } from '../../../Services/absence.service';
import { UserSession } from '../../../Services/userSession.service';
import { CommunicationService } from '../../../Services/communication.service';
import { DataContext } from '../../../Services/dataContext.service';
import { LeaveBalance } from '../../../Model/leaveBalance';
import { absenceComponent } from '../../Absence/absence.component';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {

  @ViewChild(absenceComponent) private abComp: absenceComponent;
  parentResourceType: number = 0;
  employeeLeaveBalance: LeaveBalance[] = Array<LeaveBalance>();
  @HostBinding('class.is-open')
  userTemplate: any;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  UserClaim: any;
  msg: string;
  UserName: string;
  isOpen = true;
  componentname: any;
  userRole: number = this.userSession.getUserRoleId();

  constructor(
    private router: Router,
    private _userService: UserService,
    private sideNavService: SideNavService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _communicationService: CommunicationService,
    private userSession: UserSession,
    private dataContext: DataContext,
    activatedroute: ActivatedRoute) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('absence') >= 0) {
          this.componentname = 'absence';
        }
        else {
          this.componentname = '';
        }
      }
    });
  }

  ngOnInit() {
    this.loadUserResources(2, -1, 0);
    this.sideNavService.change.subscribe((isOpen: any) => {
      this.isOpen = isOpen;
    });
    this._communicationService.updateLeftSidePanel.subscribe((config: any) => {
      this.parentResourceType = config.parentResourceTypeId;
      this.loadUserResources(config.resourceTypeId, config.parentResourceTypeId, config.isAdminPanel);
      if (this.parentResourceType === 2 && this.userRole === 3) {
        this.getEmployeeBalance();
      }
    });
  }

  onActivate(componentReference) {
    if (this.userRole === 3) {
      componentReference.refreshEmployeeBalance.subscribe((data) => {
        this.getEmployeeBalance();
      });
    }
  }

  loadUserResources(resourceTypeId: number, parentResourceTypeId: number, adminPortal: number): void {
    this._userService.getUserResources(resourceTypeId, parentResourceTypeId, adminPortal).subscribe((data: any) => {
      this.userTemplate = data;
    },
      error => this.msg = <any>error);
  }

  UpdateTab() {
    if (this.userRole === 3) {
      this._communicationService.RefreshTabSelection();
    }
  }

  getEmployeeBalance() {
    let filter = {
      organizationId: this.userSession.getUserOrganizationId(),
      districtId: this.userSession.getUserDistrictId(),
      year: new Date().getFullYear(),
      userId: this.userSession.getUserId()
    }
    this.dataContext.post('Leave/getEmployeeLeaveBalance', filter).subscribe((response: LeaveBalance[]) => {
      this.employeeLeaveBalance = response;
    })
  }

  toggle() {
  }
}