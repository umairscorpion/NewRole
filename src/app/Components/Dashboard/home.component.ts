import { Component, ChangeDetectorRef, HostBinding } from "@angular/core";
import { MediaMatcher } from '@angular/cdk/layout';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from '../../Service/user.service';
import { SideNavService } from '../SideNav/sideNav.service';
import { Chart } from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { LeaveRequest } from "../../Model/leaveRequest";
import { AbsenceService } from "../../Services/absence.service";
import { UserSession } from "../../Services/userSession.service";
import { HttpErrorResponse } from "@angular/common/http";
import { AbsenceSummary } from 'src/app/Model/absence.summary';
import * as moment from 'moment';
import { CommunicationService } from "../../Services/communication.service";
import { environment } from "src/environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { SplashScreenComponent } from "./splash-screen/splash-screen.component";
import { SettingsService } from "src/app/Services/settings.service";

@Component({
    selector: 'Subzz-app-dashboard',
    templateUrl: `home.component.html`,
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
    userId: string = this.userSession.getUserId();
    submittedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    absenceSummary: any;
    absenceSummary1 = [];
    FilledTenDay = [];
    UnFilledTenDay = [];
    previousDates = [];
    TotalFilledUnfilled = [];
    TotalAbsenceByGradeLevel = [];
    AbsencesByWeekDay = [];
    AbsenceBySubject = [];
    displayedColumnsForTopTenTeachers: string[] = ['Teacher', 'Absence'];
    previousDateMinusOne = moment().subtract(1, 'days').format('MM/DD');
    previousDateMinusTwo = moment().subtract(2, 'days').format('MM/DD');
    previousDateMinusThree = moment().subtract(3, 'days').format('MM/DD');
    previousDateMinusFour = moment().subtract(4, 'days').format('MM/DD');
    previousDateMinusFive = moment().subtract(5, 'days').format('MM/DD');
    previousDateMinusSix = moment().subtract(6, 'days').format('MM/DD');
    previousDateMinusSeven = moment().subtract(7, 'days').format('MM/DD');
    previousDateMinusEight = moment().subtract(8, 'days').format('MM/DD');
    previousDateMinusNine = moment().subtract(9, 'days').format('MM/DD');
    previousDateMinusTen = moment().subtract(10, 'days').format('MM/DD');
    absenceReason1 = [];
    dashboardCounter: AbsenceSummary = new AbsenceSummary();
    absenceChartSummary: AbsenceSummary = new AbsenceSummary();
    topCounter: AbsenceSummary;
    absenceReason: any;
    filledunfilledAbsence: any;
    totalFilledUnfilled: any;
    totalAbsenceByGradeLevel: any;
    absencesByWeekDay: any;
    absenceBySubject: any;
    topTenTeachers = new MatTableDataSource();
    @HostBinding('class.is-open')
    userTemplate: any;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    showViewMore: boolean = false;
    UserClaim: any;
    msg: string;
    UserName: string;
    isOpen = true;

    constructor(
        private router: Router,
        private sideNavService: SideNavService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private absenceService: AbsenceService,
        private userSession: UserSession,
        private _communicationService: CommunicationService,
        private sanitizer: DomSanitizer,
        private dialogRef: MatDialog,
        private settingsService: SettingsService
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        if (!this.userSession.isViewedNewVersion()) {
            this.settingsService.getVersionUpdate().subscribe(t => {
                console.log(t);
                // const dialogRef = this.dialogRef.open(SplashScreenComponent,
                //     {
                //         panelClass: 'splash-screen-dialog',
                //         data: t
                //     });
                // dialogRef.afterClosed().subscribe(result => {
                //     // update is viewed flag to true in user table.
                // });
            });

        }

        this.absenceService.getSummary().subscribe((summary: AbsenceSummary[]) => {
            this.bindAbsenceSummary(summary[0]);
            this.bindAbsenceReason(summary[0]);
            this.bindFilledUnfilled(summary[0]);
            this.bindTotalFilledUnfilled(summary[0]);
            this.bindAbsenceByDayWeek(summary[0]);
            // this.bindAbsenceBySubject(summary[0]);
            // this.bindTotalAbsenceByGradeLevel(summary[0]);
            this.dashboardCounter = summary[0];
        });
        this.getTopTenTeachers();
        this.GetLeaveRequests();
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });
        this.LoadUserResources();
        this.absenceSummary = new Chart('absenceBySubject', {
            type: 'horizontalBar',
            data: {
                labels: ["Math", "Science", "Reading", "Social Studies", "English", "Special Education", "Physical Education", "Career Tech", "Art"],
                datasets: [{
                    label: 'Absence By Subject',
                    data: [12, 19, 3, 5, 10, 15, 14, 10, 5],
                    backgroundColor: [
                        "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#c45850", "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9"
                    ],
                    borderColor: [

                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        display: false,
                        color: 'black',
                        // anchor:'end',
                        // clamp:true,
                        // align:'end',
                        // offset: -6 
                    },
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        this.absenceSummary = new Chart('absencesByGradeLevel', {
            type: 'pie',
            data: {
                labels: ["6th", "7th", "8th", "9th", "10th", "11th"],
                datasets: [{
                    data: [12, 19, 3, 5, 5, 12],
                    backgroundColor: [
                        '#3e95cd',
                        '#3cba9f',
                        '#8e5ea2',
                        "#c45850",
                        '#3e95cd',
                        '#3cba9f'
                    ],
                    borderColor: [
                        // '#72b8b7',
                        // '#7cbb98',
                        // '#f5c89b',
                        // 'rgba(75, 192, 192, 1)',
                        // 'rgba(153, 102, 255, 1)',
                        // '#72b8b7'

                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        display: false,
                        color: 'white',
                        // anchor:'end',
                        // clamp:true,
                        // align:'end',
                        // offset: -6 
                    },
                },
                // scales: {
                //     yAxes: [{
                //         ticks: {
                //             beginAtZero: true
                //         }
                //     }]
                // }
            }
        });
    }

    LoadUserResources(): void {
        const config = {
            resourceTypeId: 2,
            parentResourceTypeId: -1,
            isAdminPanel: 0
        }
        this._communicationService.UpdatePanel(config);
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
                        "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#3e95cd", "#8e5ea2", "#3cba9f"
                        // '#73dad9',
                        // '#b1ddc4',
                        // '#fde1c5',
                        // 'rgba(75, 192, 192, 0.2)',
                        // 'rgba(153, 102, 255, 0.2)',
                        // '#e8f1dc',
                        // '#73dad9',
                        // '#b1ddc4',
                        // 'rgba(255, 206, 86, 0.2)',
                        // 'rgba(75, 192, 192, 0.2)',
                        // '#f3f4f5',
                        // '#e8f1dc'
                    ],
                    borderColor: [
                        // '#72b8b7',
                        // '#7cbb98',
                        // '#f5c89b',
                        // 'rgba(75, 192, 192, 1)',
                        // 'rgba(153, 102, 255, 1)',
                        // '#c3cfb4',
                        // '#72b8b7',
                        // '#7cbb98',
                        // 'rgba(255, 206, 86, 1)',
                        // 'rgba(75, 192, 192, 1)',
                        // '#c7dcf2',
                        // '#c3cfb4'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        display: false,
                        color: 'black',
                        anchor: 'end',
                        clamp: true,
                        align: 'end',
                        offset: -6
                    },
                },
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
                        "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9"
                        // '#73dad9',
                        // '#b1ddc4',
                        // 'rgba(255, 206, 86, 0.2)',
                        // '#c1dbed'
                    ],
                    borderColor: [
                        // '#72b8b7',
                        // '#7cbb98',
                        // 'rgba(255, 206, 86, 1)',
                        // '#a1c6e0',
                        // 'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        display: false,
                        color: 'black'
                        // anchor:'end',
                        // clamp:true,
                        // align:'center',
                        // offset: 8,
                        // clip:false
                    },
                },
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
                        "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f"// "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#3e95cd", "#8e5ea2", "#3cba9f"
                        // '#73dad9',
                        // '#73dad9',
                        // '#73dad9',
                        // '#73dad9',
                        // '#73dad9',
                        // '#73dad9',
                        // '#73dad9',
                        // '#73dad9',
                        // '#73dad9',
                        // '#73dad9',
                        // '#73dad9',
                        // '#73dad9'
                    ],
                    borderColor: [
                        // '#72b8b7',
                        // '#72b8b7',
                        // '#72b8b7',
                        // '#72b8b7',
                        // '#72b8b7',
                        // '#72b8b7',
                        // '#72b8b7',
                        // '#72b8b7',
                        // '#72b8b7',
                        // '#72b8b7',
                        // '#72b8b7',
                        // '#72b8b7',
                    ],
                    borderWidth: 1
                },
                {
                    label: 'Unfilled',
                    data: this.UnFilledTenDay,
                    backgroundColor: [
                        "#3e95cd", "#3e95cd", "#3e95cd", "#3e95cd", "#3e95cd", "#3e95cd", "#3e95cd", "#3e95cd", "#3e95cd", "#3e95cd"
                        // "#e8c3b9", "#3e95cd", "#8e5ea2", "#3cba9f", "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#3e95cd", "#8e5ea2", "#3cba9f"
                        // '#b1ddc4',
                        // '#b1ddc4',
                        // '#b1ddc4',
                        // '#b1ddc4',
                        // '#b1ddc4',
                        // '#b1ddc4',
                        // '#b1ddc4',
                        // '#b1ddc4',
                        // '#b1ddc4',
                        // '#b1ddc4',
                        // '#b1ddc4',
                        // '#b1ddc4'
                    ],
                    borderColor: [
                        // '#7cbb98',
                        // '#7cbb98',
                        // '#7cbb98',
                        // '#7cbb98',
                        // '#7cbb98',
                        // '#7cbb98',
                        // '#7cbb98',
                        // '#7cbb98',
                        // '#7cbb98',
                        // '#7cbb98',
                        // '#7cbb98',
                        // '#7cbb98'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        display: false,
                        color: 'black',
                        anchor: 'end',
                        clamp: true,
                        align: 'end',
                        offset: -6
                    },
                },
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

    bindTotalFilledUnfilled(chartSummary: AbsenceSummary) {
        this.TotalFilledUnfilled.push(chartSummary.totalFilled);
        this.TotalFilledUnfilled.push(chartSummary.totalUnfilled);
        this.totalFilledUnfilled = new Chart('fillRate', {
            type: 'pie',
            data: {
                labels: ["Filled", "UnFilled"],
                datasets: [{
                    data: this.TotalFilledUnfilled,
                    backgroundColor: [
                        '#3cba9f', '#3e95cd'

                    ],
                    borderColor: [
                        // '#72b8b7',
                        // '#7cbb98'

                    ],
                    borderWidth: 1
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'white',
                        formatter: function (value, context) {
                            return value + '%';
                        }
                    },
                }
            },
        });
    }

    bindTotalAbsenceByGradeLevel(chartSummary: AbsenceSummary) {
        this.TotalAbsenceByGradeLevel.push(chartSummary.gradeSix);
        this.TotalAbsenceByGradeLevel.push(chartSummary.gradeSeven);
        this.TotalAbsenceByGradeLevel.push(chartSummary.gradeEight);
        this.TotalAbsenceByGradeLevel.push(chartSummary.gradeNine);
        this.TotalAbsenceByGradeLevel.push(chartSummary.gradeTen);
        this.TotalAbsenceByGradeLevel.push(chartSummary.gradeEleven);
        this.totalAbsenceByGradeLevel = new Chart('absencesByGradeLevel', {
            type: 'pie',
            data: {
                labels: ["6th", "7th", "8th", "9th", "10th", "11th"],
                datasets: [{
                    data: this.TotalAbsenceByGradeLevel,
                    backgroundColor: [
                        '#3e95cd',
                        '#3cba9f',
                        '#8e5ea2',
                        "#c45850",
                        '#3e95cd',
                        '#3cba9f'
                    ],
                    borderColor: [
                        // '#72b8b7',
                        // '#7cbb98',
                        // '#f5c89b',
                        // 'rgba(75, 192, 192, 1)',
                        // 'rgba(153, 102, 255, 1)',
                        // '#72b8b7'

                    ],
                    borderWidth: 1
                }]
            },
            options: {
                // scales: {
                //     yAxes: [{
                //         ticks: {
                //             beginAtZero: true
                //         }
                //     }]
                // }
            }
        });
    }

    bindAbsenceByDayWeek(chartSummary: AbsenceSummary) {
        this.AbsencesByWeekDay.push(chartSummary.weekDayMonday);
        this.AbsencesByWeekDay.push(chartSummary.weekDayTuesday);
        this.AbsencesByWeekDay.push(chartSummary.weekDayWednesday);
        this.AbsencesByWeekDay.push(chartSummary.weekDayThursday);
        this.AbsencesByWeekDay.push(chartSummary.weekDayFriday);
        this.absencesByWeekDay = new Chart('absenceByDayOfWeek', {
            type: 'bar',
            data: {
                labels: ["M", "T", "W", "TH", "F"],
                datasets: [{
                    // label: 'Absence By Day Of Week',
                    data: this.AbsencesByWeekDay,
                    backgroundColor: [
                        "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"
                    ],
                    borderColor: [

                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        display: false,
                        color: 'black',
                        anchor: 'end',
                        clamp: true,
                        align: 'end',
                        offset: -6
                    },
                },
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

    bindAbsenceBySubject(chartSummary: AbsenceSummary) {
        this.AbsenceBySubject.push(chartSummary.subjectMath);
        this.AbsenceBySubject.push(chartSummary.subjectScience);
        this.AbsenceBySubject.push(chartSummary.subjectReading);
        this.AbsenceBySubject.push(chartSummary.subjectSocial);
        this.AbsenceBySubject.push(chartSummary.subjectEnglish);
        this.AbsenceBySubject.push(chartSummary.subjectSpecial);
        this.AbsenceBySubject.push(chartSummary.subjectPhysical);
        this.AbsenceBySubject.push(chartSummary.subjectCareer);
        this.AbsenceBySubject.push(chartSummary.subjectArt);
        this.absenceBySubject = new Chart('absenceBySubject', {
            type: 'horizontalBar',
            data: {
                labels: ["Math", "Science", "Reading", "Social Studies", "English", "Special Education", "Physical Education", "Career Tech", "Art"],
                datasets: [{
                    // label: 'Absence By Subject',
                    data: this.absenceBySubject,
                    backgroundColor: [
                        "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3cba9f", "#3e95cd", "#8e5ea2", "#3cba9f"
                    ],
                    borderColor: [

                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        display: false,
                        color: 'black',
                        anchor: 'end',
                        clamp: true,
                        align: 'end',
                        offset: -6
                    },
                },

                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
            }
        });
    }

    getTopTenTeachers() {
        this.absenceService.getTopTenTeachers().subscribe((details: AbsenceSummary[]) => {
            this.topTenTeachers.data = details;
        });

    }

    toggle() {
    }

    GetLeaveRequests(): void {
        let districtId = this.userSession.getUserDistrictId();
        let organizationId = this.userSession.getUserOrganizationId() ? this.userSession.getUserOrganizationId() : '-1';
        this.absenceService.getLeaveRequests(districtId, organizationId).subscribe((leaveRequests: LeaveRequest[]) => {
            this.submittedLeaveRequests = leaveRequests.filter(t => t.isApproved === false && t.isDeniend === false);
            if (this.submittedLeaveRequests.length > 4) {
                this.showViewMore = true;
            }
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

    openDailyReportPage() {
        this.router.navigate(['/reports']);
    }

    openLeaveRequestPagePage() {
        this.router.navigate(['/manage/leave']);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    getImage(imageName: string) {
        if (imageName && imageName.length > 0) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(environment.profileImageUrl + imageName);
        }
    }
}