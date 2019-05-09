import { Component, OnInit, ViewChild, ChangeDetectorRef, HostBinding } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { MonthlyReportsComponent } from './SubPages/MonthlyReports/monthyReports.component';
import { DailyReportsComponent } from './SubPages/DailyReports/dailyReports.component';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    templateUrl: 'reports.component.html',
    styleUrls: ['reports.component.css']
})
export class ReportsComponent implements OnInit {
    @ViewChild(MonthlyReportsComponent) private monthlyComponent: MonthlyReportsComponent;
    @ViewChild(DailyReportsComponent) private dailyComponent: DailyReportsComponent;
    sideNavMenu: any;
    msg: string;
    @HostBinding('class.is-open')
    mobileQuery: MediaQueryList;
    selectedTab: any;
    private _mobileQueryListener: () => void;
    constructor(private router: Router, private _userService: UserService, changeDetectorRef: ChangeDetectorRef
        , media: MediaMatcher, private route: ActivatedRoute) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
    ngOnInit(): void {
        this.route.queryParams.subscribe((params: any) => {
            if (params['Tab']) {
                this.selectedTab = params.Tab;
            }
        });
        this.LoadSideNavMenu();
    }
    LoadSideNavMenu(): void {
        let resourceTypeId = 2;
        let parentResourceTypeId = -1;
        this._userService.getUserResources(resourceTypeId, parentResourceTypeId, 0).subscribe((data: any) => {
            this.sideNavMenu = data;
        },
            error => this.msg = <any>error);
    }

    onChangeTab(tab: any) {
        if (tab.index == 1) {
            this.router.navigateByUrl('/absence', { skipLocationChange: true }).then(() =>
                this.router.navigate(["reports"], { queryParams: { Tab: "1" } }));
        }

        if (tab.index == 0) {
            this.router.navigateByUrl('/absence', { skipLocationChange: true }).then(() =>
                this.router.navigate(["reports"], { queryParams: { Tab: "0" } }));
        }

        if (tab.index == 2) {
            this.router.navigateByUrl('/absence', { skipLocationChange: true }).then(() =>
                this.router.navigate(["reports"], { queryParams: { Tab: "2" } }));
        }
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}