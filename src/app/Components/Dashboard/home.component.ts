import { Component, ViewContainerRef, ChangeDetectorRef, OnDestroy, HostBinding, Input } from "@angular/core";
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { UserService } from '../../Service/user.service';
import { SideNavService } from '../SideNav/sideNav.service'; 
import { Chart } from 'chart.js'

@Component({
    selector: 'Subzz-app-dashboard',
    templateUrl: `home.component.html`,
    styleUrls: ['home.component.css']
})

export class HomeComponent {
    absenceSummary : Chart ;
    absenceReason : Chart;
    filledunfilledAbsence : Chart;
    @HostBinding('class.is-open')
    userTemplate: any;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    
    UserClaim: any;
    msg: string;
    UserName: string;
    isOpen = true;
    constructor(private router: Router, private _userService: UserService, private sideNavService: SideNavService ,
          vcr: ViewContainerRef, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
        // this.toastr.setRootViewContainerRef(vcr);
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
   
    ngOnInit(): void {
        this.absenceSummary = new Chart('absenceSummary', {
           type: 'bar',
           data: {
               labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
               datasets: [{
                   label: 'Absence Summary',
                   data: [12, 19, 3, 5, 1, 1, 12, 19, 3, 5, 1, 1],
                   backgroundColor: [
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(255, 206, 86, 0.2)',
                       'rgba(75, 192, 192, 0.2)',
                       'rgba(153, 102, 255, 0.2)',
                       'rgba(255, 159, 64, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(255, 206, 86, 0.2)',
                       'rgba(75, 192, 192, 0.2)',
                       'rgba(153, 102, 255, 0.2)',
                       'rgba(255, 159, 64, 0.2)'
                   ],
                   borderColor: [
                       'rgba(255,99,132,1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(255, 206, 86, 1)',
                       'rgba(75, 192, 192, 1)',
                       'rgba(153, 102, 255, 1)',
                       'rgba(255, 159, 64, 1)',
                       'rgba(255,99,132,1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(255, 206, 86, 1)',
                       'rgba(75, 192, 192, 1)',
                       'rgba(153, 102, 255, 1)',
                       'rgba(255, 159, 64, 1)'
                   ],
                   borderWidth: 1
               }]
           },
           options: {
               scales: {
                   yAxes: [{
                       ticks: {
                           beginAtZero:true
                       }
                   }]
               }
           }
         });
         this.absenceReason = new Chart('absenceReason', {
           type: 'horizontalBar',
           data: {
               labels: ["Personal Leave", "illness Self", "Other", "PD"],
               datasets: [{
                   label: 'Absence Reason',
                   data: [12, 19, 3, 5],
                   backgroundColor: [
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(255, 206, 86, 0.2)',
                       'rgba(75, 192, 192, 0.2)'
                   ],
                   borderColor: [
                       'rgba(255,99,132,1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(255, 206, 86, 1)',
                       'rgba(75, 192, 192, 1)',
                       'rgba(153, 102, 255, 1)'
                   ],
                   borderWidth: 1
               }]
           },
           options: {
               scales: {
                   yAxes: [{
                       ticks: {
                           beginAtZero:true
                       }
                   }]
               }
           }
         });
         this.filledunfilledAbsence = new Chart('filledunfilledAbsence', {
           type: 'bar',
           data: {
               labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
               datasets: [{
                   label: 'Filled',
                   data: [12, 19, 3, 5, 1, 1, 12, 19, 3, 5, 1, 1],
                   backgroundColor: [
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(255, 99, 132, 0.2)',
                   ],
                   borderColor: [
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                       'rgba(255,99,132,1)',
                   ],
                   borderWidth: 1
               },
               {
                   label: 'Unfilled',
                   data: [12, 19, 3, 5, 1, 1, 12, 19, 3, 5, 1, 1],
                   backgroundColor: [
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                   ],
                   borderColor: [
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(54, 162, 235, 1)',
                   ],
                   borderWidth: 1
               }]
           },
           options: {
               scales: {
                   yAxes: [{
                       ticks: {
                           beginAtZero:true
                       }
                   }]
               }
           }
         });
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });
        this.LoadUserResources();
    }
    LoadUserResources(): void {
        let resourceTypeId = 2;
        let parentResourceTypeId = -1;
        let adminPortal = 0;
        this._userService.getUserResources(resourceTypeId,parentResourceTypeId,adminPortal).subscribe((data: any) => {
            this.userTemplate = data;
        },
            error => this.msg = <any>error);
    }
    toggle() {
    }
    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}