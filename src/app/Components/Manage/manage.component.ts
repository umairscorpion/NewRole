import { Component, OnInit, ViewChild ,ChangeDetectorRef, HostBinding } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { SideNavService } from '../SideNav/sideNav.service'; 

@Component({
    templateUrl: 'manage.component.html',
    styleUrls: ['manage.component.css']
})
export class ManageComponent {
    sideNavMenu: any;
    isOpen = true;
    msg :string;
    // @HostBinding('class.is-open')
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    constructor(private router: Router, private _userService: UserService, changeDetectorRef: ChangeDetectorRef ,
        private sideNavService: SideNavService,media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
     }
    ngOnInit(): void {
        this.LoadSideNavMenu();
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });
    }
    LoadSideNavMenu(): void {
        let resourceTypeId = 3;
        let parentResourceTypeId = 1;
        let isAdminPanel = 0;
        this._userService.getUserResources(resourceTypeId,parentResourceTypeId,isAdminPanel).subscribe((data: any) => {
            this.sideNavMenu = data;
        },
            error => this.msg = <any>error);
    }
    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}