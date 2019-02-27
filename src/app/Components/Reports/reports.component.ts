import { Component, OnInit, ViewChild ,ChangeDetectorRef, HostBinding } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    templateUrl: 'reports.component.html',
    styleUrls: ['reports.component.css']
})
export class ReportsComponent implements OnInit {
    sideNavMenu: any;
    msg :string;
    @HostBinding('class.is-open')
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    constructor(private router: Router, private _userService: UserService, changeDetectorRef: ChangeDetectorRef ,media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
     }
    ngOnInit(): void {
        this.LoadSideNavMenu();
    }
    LoadSideNavMenu(): void {
        let resourceTypeId = 3;
        let parentResourceTypeId = 6;
        this._userService.getUserResources(resourceTypeId,parentResourceTypeId,0).subscribe((data: any) => {
            this.sideNavMenu = data;
        },
            error => this.msg = <any>error);
    }
    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}