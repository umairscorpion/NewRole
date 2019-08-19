import { Component, ChangeDetectorRef, HostBinding, OnInit } from "@angular/core";
import { MediaMatcher } from '@angular/cdk/layout';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
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
import { DashboardSummary } from "src/app/Model/DashboardSummary";
import { SplashScreenComponent } from "./splash-screen/splash-screen.component";
import { SettingsService } from "src/app/Services/settings.service";
import swal from 'sweetalert2';
import { NotifierService } from "angular-notifier";
import { DataContext } from "../../Services/dataContext.service";
import { interval, Subscription } from 'rxjs';
import { Announcement } from "../../Model/announcement";
import { ShowAnnouncementPopupComponent } from "../Announcement/show-announcement-popup/show-announcement-popup.component";

@Component({
    selector: 'Subzz-app-dashboard',
    templateUrl: `home.component.html`,
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
    private notifier: NotifierService;
    private updateSubscription: Subscription;
    userId: string = this.userSession.getUserId();
    submittedLeaveRequests: LeaveRequest[] = Array<LeaveRequest>();
    absenceSummary: any;
    AbsenceSummary = [];
    FilledTenDay = [];
    AbsenceReason = [];
    AbsenceReasonTitle = [];
    UnFilledTenDay = [];
    previousDates = [];
    TotalFilledUnfilled = [];
    TotalAbsenceByGradeLevel = [];
    TotalAbsenceByGradeLevelTitle = [];
    AbsencesByWeekDay = [];
    AbsenceBySubject = [];
    AbsenceBySubjectTitle = [];
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
    // For Announcements
    Announcements: Announcement[] = Array<Announcement>();
    IsAnnouncementViewed: boolean = false;

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
        private settingsService: SettingsService,
        notifier: NotifierService,
        private dataContext: DataContext,
        private activatedRoute: ActivatedRoute) {
        this.notifier = notifier;
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.jobId && params.ac == 3) {
                this.onApproveClick(0, params.jobId, 'NULL');
            }
            else if(params.jobId && params.ac == 4){
                this.onDenyClick(0, params.jobId, 'NULL');
            }
            else
            return;
                
        })
        this.absenceService.getSummary().subscribe((summary: any) => {
            this.bindAbsenceSummary(summary);
            this.bindAbsenceReason(summary);
            this.bindFilledUnfilled(summary);
            this.bindTotalFilledUnfilled(summary);
            this.bindAbsenceByDayWeek(summary);
            this.bindAbsenceBySubject(summary);
            this.bindTotalAbsenceByGradeLevel(summary);
            this.dashboardCounter = summary.absenceSummary[0];
            if (!this.userSession.isViewedNewVersion()) {
                this.settingsService.getVersionUpdate().subscribe(t => {
                    console.log(t);
                    const dialogRef = this.dialogRef.open(SplashScreenComponent,
                        {
                            panelClass: 'splash-screen-dialog',
                            data: t
                        });
                    dialogRef.afterClosed().subscribe(result => {
                        this.UserClaim = JSON.parse(localStorage.getItem('userClaims'));
                        let user = {
                            UserId: this.userSession.getUserId(),
                            FirstName: this.UserClaim.firstName,
                            LastName: this.UserClaim.lastName,
                            Email: this.UserClaim.email,
                            PhoneNumber: this.UserClaim.phoneNumber,
                            ProfilePicture: this.UserClaim.profilePicture,
                            IsViewedNewVersion: true
                        }
                        this.dataContext.Patch('user/updateUserProfile', user).subscribe((data: any) => {
                            this.UserClaim.isViewedNewVersion = true;
                            localStorage.setItem('userClaims', JSON.stringify(this.UserClaim));
                            this.userSession.SetUserSession();
                        },
                            (err: HttpErrorResponse) => {
                            });
                    });
                });

            }
        });
        this.getTopTenTeachers();
        this.GetLeaveRequests();
        this.sideNavService.change.subscribe((isOpen: any) => {
            this.isOpen = isOpen;
        });
        this.LoadUserResources();
        let UserRoleId = this.userSession.getUserRoleId();
        if (UserRoleId === 1 || UserRoleId === 2) {
            this.GetAndViewAnnouncement();
        }
    }

    LoadUserResources(): void {
        const config = {
            resourceTypeId: 2,
            parentResourceTypeId: -1,
            isAdminPanel: 0
        }
        this._communicationService.UpdatePanel(config);
    }

    bindAbsenceSummary(chartSummary: DashboardSummary) {
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].january);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].february);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].march);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].april);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].may);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].june);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].july);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].august);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].september);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].october);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].november);
        this.AbsenceSummary.push(chartSummary.absenceSummary[0].december);

        this.absenceSummary = new Chart('absenceSummary', {
            type: 'bar',
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                    label: 'Absence Summary',
                    data: this.AbsenceSummary,
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

    bindAbsenceReason(chartSummary: DashboardSummary) {
        this.AbsenceReason.push(chartSummary.absenceSummary[0].personalLeave);
        this.AbsenceReason.push(chartSummary.absenceSummary[0].illnessSelf);
        this.AbsenceReason.push(chartSummary.absenceSummary[0].other);
        this.AbsenceReason.push(chartSummary.absenceSummary[0].pd);
        this.absenceReason = new Chart('absenceReason', {
            type: 'horizontalBar',
            data: {
                labels: ["Personal Leave", "ilness Self", "Other", "PD"],
                datasets: [{
                    label: 'Absence Reason',
                    data: this.AbsenceReason,
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

    bindFilledUnfilled(chartSummary: DashboardSummary) {
        //Filled Ten Days 
        this.FilledTenDay.push(chartSummary.absenceSummary[0].filledPreviousMinusTen);
        this.FilledTenDay.push(chartSummary.absenceSummary[0].filledPreviousMinusNine);
        this.FilledTenDay.push(chartSummary.absenceSummary[0].filledPreviousMinusEight);
        this.FilledTenDay.push(chartSummary.absenceSummary[0].filledPreviousMinusSeven);
        this.FilledTenDay.push(chartSummary.absenceSummary[0].filledPreviousMinusSix);
        this.FilledTenDay.push(chartSummary.absenceSummary[0].filledPreviousMinusFive);
        this.FilledTenDay.push(chartSummary.absenceSummary[0].filledPreviousMinusFour);
        this.FilledTenDay.push(chartSummary.absenceSummary[0].filledPreviousMinusThree);
        this.FilledTenDay.push(chartSummary.absenceSummary[0].filledPreviousMinusTwo);
        this.FilledTenDay.push(chartSummary.absenceSummary[0].filledPreviousMinusOne);
        //UnFilled Ten Days
        this.UnFilledTenDay.push(chartSummary.absenceSummary[0].unfilledPreviousMinusTen);
        this.UnFilledTenDay.push(chartSummary.absenceSummary[0].unfilledPreviousMinusNine);
        this.UnFilledTenDay.push(chartSummary.absenceSummary[0].unfilledPreviousMinusEight);
        this.UnFilledTenDay.push(chartSummary.absenceSummary[0].unfilledPreviousMinusSeven);
        this.UnFilledTenDay.push(chartSummary.absenceSummary[0].unfilledPreviousMinusSix);
        this.UnFilledTenDay.push(chartSummary.absenceSummary[0].unfilledPreviousMinusFive);
        this.UnFilledTenDay.push(chartSummary.absenceSummary[0].unfilledPreviousMinusFour);
        this.UnFilledTenDay.push(chartSummary.absenceSummary[0].unfilledPreviousMinusThree);
        this.UnFilledTenDay.push(chartSummary.absenceSummary[0].unfilledPreviousMinusTwo);
        this.UnFilledTenDay.push(chartSummary.absenceSummary[0].unfilledPreviousMinusOne);
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

    bindTotalFilledUnfilled(chartSummary: DashboardSummary) {
        this.TotalFilledUnfilled.push(chartSummary.absenceSummary[0].totalFilled);
        this.TotalFilledUnfilled.push(chartSummary.absenceSummary[0].totalUnfilled);
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

    bindTotalAbsenceByGradeLevel(chartSummary: DashboardSummary) {
        // this.TotalAbsenceByGradeLevel.push(chartSummary.absenceByGradeLevel[0].sixthGrade);
        // this.TotalAbsenceByGradeLevel.push(chartSummary.absenceByGradeLevel[0].seventhGrade);
        // this.TotalAbsenceByGradeLevel.push(chartSummary.absenceByGradeLevel[0].eighthGrade);
        // this.TotalAbsenceByGradeLevel.push(chartSummary.absenceByGradeLevel[0].ninthGrade);
        // this.TotalAbsenceByGradeLevel.push(chartSummary.absenceByGradeLevel[0].tenthGrade);
        // this.TotalAbsenceByGradeLevel.push(chartSummary.absenceByGradeLevel[0].eleventhGrade);
        chartSummary.absenceByGradeLevel.forEach(element => {
            this.TotalAbsenceByGradeLevel.push(element.total);
            this.TotalAbsenceByGradeLevelTitle.push(element.title);
        });

        // this.TotalAbsenceByGradeLevelTitle.push(chartSummary.absenceByGradeLevel[0].title);
        this.totalAbsenceByGradeLevel = new Chart('absencesByGradeLevel', {
            type: 'pie',
            data: {
                // labels: ['6th', '7th', '8th', '9th', '10th', '11th'],
                labels: this.TotalAbsenceByGradeLevelTitle,
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

    bindAbsenceByDayWeek(chartSummary: DashboardSummary) {
        this.AbsencesByWeekDay.push(chartSummary.absenceSummary[0].weekDayMonday);
        this.AbsencesByWeekDay.push(chartSummary.absenceSummary[0].weekDayTuesday);
        this.AbsencesByWeekDay.push(chartSummary.absenceSummary[0].weekDayWednesday);
        this.AbsencesByWeekDay.push(chartSummary.absenceSummary[0].weekDayThursday);
        this.AbsencesByWeekDay.push(chartSummary.absenceSummary[0].weekDayFriday);
        this.absencesByWeekDay = new Chart('absenceByDayOfWeek', {
            type: 'bar',
            data: {
                labels: ["M", "T", "W", "TH", "F"],
                datasets: [{
                    label: 'Absences By Week',
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

    bindAbsenceBySubject(chartSummary: DashboardSummary) {
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectEnglish);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectHistory);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectMath);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectScience);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectPE);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectMusic);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectArt);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectTechnology);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectWorld);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectCareer);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectSpecial);
        this.AbsenceBySubject.push(chartSummary.absenceBySubject[0].subjectAdult);
        this.absenceBySubject = new Chart('absenceBySubject', {
            type: 'horizontalBar',
            data: {
                labels: ["English/LA", "History/SS", "Math", "Science", "P.E.", "Music", "Art", "Technology", "World Languages", "Career Tech", "Special Ed", "Adult Ed"],
                // labels: this.AbsenceBySubjectTitle,
                datasets: [{
                    label: 'Absences By Subject',
                    data: this.AbsenceBySubject,
                    backgroundColor: [
                        "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3cba9f", "#3e95cd", "#8e5ea2", "#3cba9f", "#3e95cd", "#8e5ea2", "#3cba9f"
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
        this.absenceService.getTopTenTeachers().subscribe((details: DashboardSummary[]) => {
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

    onApproveClick(leaveRequestId: number, absenceId: string, confirmationNumber: string) {
        let leaveStatusModel = {
            LeaveRequestId: leaveRequestId,
            IsApproved: 1,
            IsDeniend: 0,
            isArchived: 0,
            AbsenceId: absenceId,
            ConfirmationNumber: confirmationNumber
        }
        swal.fire({
            title: 'Approve',
            text:
                'Are you sure, you want to Approve the selected Request?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-success',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then(r => {
            if (r.value) {
                this.absenceService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
                    this.GetLeaveRequests();
                    this.notifier.notify('success', 'Approved Successfully.');
                },
                    error => this.msg = <any>error);
            }
        });
    }

    onDenyClick(leaveRequestId: number, absenceId: string, confirmationNumber: string) {
        let leaveStatusModel = {
            leaveRequestId: leaveRequestId,
            isApproved: 0,
            isDeniend: 1,
            isArchived: 0,
            AbsenceId: absenceId,
            ConfirmationNumber: confirmationNumber
        }
        swal.fire({
            title: 'Deny',
            text:
                'Are you sure, you want to Deny the selected Request?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-success',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then(r => {
            if (r.value) {
                this.absenceService.post('Leave/updateLeaveRequestStatus', leaveStatusModel).subscribe((data: any) => {
                    this.GetLeaveRequests();
                    this.notifier.notify('success', 'Denied Successfully.');
                },
                    error => this.msg = <any>error);
            }
        });
    }

    openDailyReportPage() {
        this.router.navigate(['/reports']);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    getImage(imageName: string) {
        if (imageName && imageName.length > 0) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(environment.profileImageUrl + imageName);
        }
    }

    jumpToLeaveRequests() {
        this.router.navigate(['/manage/leave'], { queryParams: { Tab: 1 } })
    }

    GetAndViewAnnouncement() {
        let model = {
            DistrictId: this.userSession.getUserDistrictId(),
            OrganizationId: this.userSession.getUserOrganizationId()
        }
        this.dataContext.post('announcement/getAnnouncement', model).subscribe((data: any) => {
            this.Announcements = data;
            if (data.length > 0) {
                this.dialogRef.open(
                    ShowAnnouncementPopupComponent, {
                        panelClass: 'announcements-dialog',
                        data: this.Announcements
                    }
                );
            }
        },
            error => <any>error);
    }
}