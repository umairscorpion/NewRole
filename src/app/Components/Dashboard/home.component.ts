import { Component, ViewContainerRef, ChangeDetectorRef, OnDestroy, HostBinding, Input } from "@angular/core";
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { UserService } from '../../Service/user.service';
import { SideNavService } from '../SideNav/sideNav.service';
import { Chart } from 'chart.js'
import { LeaveRequest } from "../../Model/leaveRequest";
import { AbsenceService } from "../../Services/absence.service";
import { UserSession } from "../../Services/userSession.service";
import { HttpErrorResponse } from "@angular/common/http";
import { AbsenceSummary } from 'src/app/Model/absence.summary';
import * as moment from 'moment';

@Component({
    selector: 'Subzz-app-dashboard',
    templateUrl: `home.component.html`,
    styleUrls: ['home.component.css']
})

export class HomeComponent {
    userId: string = this.userSession.getUserId();
    submittedLeaveRequests: LeaveRequest[];
    absenceSummary: any;
    absenceSummary1 = [];
    FilledTenDay = [];
    UnFilledTenDay = [];
    previousDates = [];
    previousDateMinusOne =  moment().subtract(1,'days').format('MM/DD');
    previousDateMinusTwo =  moment().subtract(2,'days').format('MM/DD');
    previousDateMinusThree =  moment().subtract(3,'days').format('MM/DD');
    previousDateMinusFour =  moment().subtract(4,'days').format('MM/DD');
    previousDateMinusFive =  moment().subtract(5,'days').format('MM/DD');
    previousDateMinusSix =  moment().subtract(6,'days').format('MM/DD');
    previousDateMinusSeven =  moment().subtract(7,'days').format('MM/DD');
    previousDateMinusEight =  moment().subtract(8,'days').format('MM/DD');
    previousDateMinusNine =  moment().subtract(9,'days').format('MM/DD');
    previousDateMinusTen =  moment().subtract(10,'days').format('MM/DD');
    absenceReason1 = [];
    dashboardCounter: AbsenceSummary = new AbsenceSummary();
    absenceChartSummary: AbsenceSummary = new AbsenceSummary();
    topCounter:AbsenceSummary;
    absenceReason: any;
    filledunfilledAbsence: any;
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
        // this.toastr.setRootViewContainerRef(vcr);
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        
        this.absenceService.getSummary().subscribe((summary: AbsenceSummary[]) => {
            this.bindAbsenceSummary(summary[0]);
            this.bindAbsenceReason(summary[0]);
            this.bindFilledUnfilled(summary[0]);
            this.dashboardCounter = summary[0];
        });

        // this.absenceService.getReasonSummary().subscribe((summary: AbsenceSummary[]) => {
        //     this.bindAbsenceReason(summary[0]);
        // });

        this.GetLeaveRequests();


        
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });
        this.LoadUserResources();
    }
    LoadUserResources(): void {
        let resourceTypeId = 2;
        let parentResourceTypeId = -1;
        let adminPortal = 0;
        this._userService.getUserResources(resourceTypeId, parentResourceTypeId, adminPortal).subscribe((data: any) => {
            this.userTemplate = data;
        },
            error => this.msg = <any>error);
    }

    bindAbsenceSummary(chartSummary: AbsenceSummary) {
        this.absenceSummary1.push(chartSummary.january);
        this.absenceSummary1.push(chartSummary.february);
        this.absenceSummary1.push(chartSummary.march);
        this.absenceSummary1.push(chartSummary.april);
        this.absenceSummary1.push(chartSummary.may);
        this.absenceSummary1.push(chartSummary.june);
        this.absenceSummary1.push(chartSummary.july);
        this.absenceSummary1.push(chartSummary.august);
        this.absenceSummary1.push(chartSummary.september);
        this.absenceSummary1.push(chartSummary.october);
        this.absenceSummary1.push(chartSummary.november);
        this.absenceSummary1.push(chartSummary.december);

        this.absenceSummary = new Chart('absenceSummary', {
            type: 'bar',
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                    label: 'Absence Summary',
                    data: this.absenceSummary1,
                    // data: [12, 19, 3, 5, 1, 1, 12, 19, 3, 5, 1, 1],
                    backgroundColor: [
                        '#73dad9',
                        '#b1ddc4',
                        '#fde1c5',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        '#e8f1dc',
                        '#73dad9',
                        '#b1ddc4',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        '#f3f4f5',
                        '#e8f1dc'
                    ],
                    borderColor: [
                        '#72b8b7',
                        '#7cbb98',
                        '#f5c89b',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        '#c3cfb4',
                        '#72b8b7',
                        '#7cbb98',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        '#c7dcf2',
                        '#c3cfb4'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    bindAbsenceReason(chartSummary: AbsenceSummary) {
        this.absenceReason1.push(chartSummary.personalLeave);
        this.absenceReason1.push(chartSummary.illnessSelf);
        this.absenceReason1.push(chartSummary.other);
        this.absenceReason1.push(chartSummary.pd);
        this.absenceReason = new Chart('absenceReason', {
            type: 'horizontalBar',
            data: {
                labels: ["Personal Leave", "illness Self", "Other", "PD"],
                datasets: [{
                    label: 'Absence Reason',
                    data: this.absenceReason1,
                    backgroundColor: [
                        '#73dad9',
                        '#b1ddc4',
                        'rgba(255, 206, 86, 0.2)',
                        '#c1dbed'
                    ],
                    borderColor: [
                        '#72b8b7',
                        '#7cbb98',
                        'rgba(255, 206, 86, 1)',
                        '#a1c6e0',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
 bindFilledUnfilled(chartSummary: AbsenceSummary) {
    //Filled Ten Days 
    this.FilledTenDay.push(chartSummary.filledPreviousMinusTen);
     this.FilledTenDay.push(chartSummary.filledPreviousMinusNine);
     this.FilledTenDay.push(chartSummary.filledPreviousMinusEight);
     this.FilledTenDay.push(chartSummary.filledPreviousMinusSeven);
     this.FilledTenDay.push(chartSummary.filledPreviousMinusSix);
     this.FilledTenDay.push(chartSummary.filledPreviousMinusFive);
     this.FilledTenDay.push(chartSummary.filledPreviousMinusFour);
     this.FilledTenDay.push(chartSummary.filledPreviousMinusThree);
     this.FilledTenDay.push(chartSummary.filledPreviousMinusTwo);
     this.FilledTenDay.push(chartSummary.filledPreviousMinusOne);
     //UnFilled Ten Days
     this.UnFilledTenDay.push(chartSummary.unfilledPreviousMinusTen);
     this.UnFilledTenDay.push(chartSummary.unfilledPreviousMinusNine);
     this.UnFilledTenDay.push(chartSummary.unfilledPreviousMinusEight);
     this.UnFilledTenDay.push(chartSummary.unfilledPreviousMinusSeven);
     this.UnFilledTenDay.push(chartSummary.unfilledPreviousMinusSix);
     this.UnFilledTenDay.push(chartSummary.unfilledPreviousMinusFive);
     this.UnFilledTenDay.push(chartSummary.unfilledPreviousMinusFour);
     this.UnFilledTenDay.push(chartSummary.unfilledPreviousMinusThree);
     this.UnFilledTenDay.push(chartSummary.unfilledPreviousMinusTwo);
     this.UnFilledTenDay.push(chartSummary.unfilledPreviousMinusOne);
    //Filled Unfilled Ten days Labels
    this.previousDates.push(this.previousDateMinusTen);
    this.previousDates.push(this.previousDateMinusNine);
    this.previousDates.push(this.previousDateMinusEight);
    this.previousDates.push(this.previousDateMinusSeven);
    this.previousDates.push(this.previousDateMinusSix);
    this.previousDates.push(this.previousDateMinusFive);
    this.previousDates.push(this.previousDateMinusFour);
    this.previousDates.push(this.previousDateMinusThree);
    this.previousDates.push(this.previousDateMinusTwo);
    this.previousDates.push(this.previousDateMinusOne);


    this.filledunfilledAbsence = new Chart('filledunfilledAbsence', {
        type: 'bar',
        data: {
            labels: this.previousDates,
            datasets: [{
                label: 'Filled',
                data: this.FilledTenDay,
                backgroundColor: [
                    '#73dad9',
                    '#73dad9',
                    '#73dad9',
                    '#73dad9',
                    '#73dad9',
                    '#73dad9',
                    '#73dad9',
                    '#73dad9',
                    '#73dad9',
                    '#73dad9',
                    '#73dad9',
                    '#73dad9'
                ],
                borderColor: [
                    '#72b8b7',
                    '#72b8b7',
                    '#72b8b7',
                    '#72b8b7',
                    '#72b8b7',
                    '#72b8b7',
                    '#72b8b7',
                    '#72b8b7',
                    '#72b8b7',
                    '#72b8b7',
                    '#72b8b7',
                    '#72b8b7',
                ],
                borderWidth: 1
            },
            {
                label: 'Unfilled',
                data: this.UnFilledTenDay,
                backgroundColor: [
                    '#b1ddc4',
                    '#b1ddc4',
                    '#b1ddc4',
                    '#b1ddc4',
                    '#b1ddc4',
                    '#b1ddc4',
                    '#b1ddc4',
                    '#b1ddc4',
                    '#b1ddc4',
                    '#b1ddc4',
                    '#b1ddc4',
                    '#b1ddc4'
                ],
                borderColor: [
                    '#7cbb98',
                    '#7cbb98',
                    '#7cbb98',
                    '#7cbb98',
                    '#7cbb98',
                    '#7cbb98',
                    '#7cbb98',
                    '#7cbb98',
                    '#7cbb98',
                    '#7cbb98',
                    '#7cbb98',
                    '#7cbb98'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

 }

    toggle() {
    }

    GetLeaveRequests(): void {
        let districtId = this.userSession.getUserDistrictId();
        let organizationId = this.userSession.getUserOrganizationId() ? this.userSession.getUserOrganizationId() : '-1';
        this.absenceService.getLeaveRequests(districtId, organizationId).subscribe((leaveRequests: LeaveRequest[]) => {
            this.submittedLeaveRequests = leaveRequests.filter(t => t.isApproved === false && t.isDeniend === false);
        },
            error => this.msg = <any>error);
    }

    onApproveClick(leaveRequestId: number, absenceId: string) {
        let leaveStatusModel = {
            LeaveRequestId: leaveRequestId,
            IsApproved: 1,
            IsDeniend: 0,
            isArchived: 0,
            AbsenceId: absenceId
        }
        this.absenceService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
            this.GetLeaveRequests();
            // this.toastr.success('Status Updated Successfully!', 'Success!');
        },
            (err: HttpErrorResponse) => {
                // this.toastr.error(err.error.error_description, 'Oops!');
            });
    }

    onDenyClick(leaveRequestId: number, absenceId: string) {
        let leaveStatusModel = {
            leaveRequestId: leaveRequestId,
            isApproved: 0,
            isDeniend: 1,
            isArchived: 0,
            AbsenceId: absenceId
        }
        this.absenceService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
            this.GetLeaveRequests();
        },
            (err: HttpErrorResponse) => {
            });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}