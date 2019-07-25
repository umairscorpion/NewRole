import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Components/User/Login/login.component';
import { HomeComponent } from './Components/Dashboard/home.component';

//Absence Components
import { absenceComponent } from './Components/Absence/absence.component';
import { AbortedAbsenceComponent } from './Components/Absence/SubPages/AbortedAbsence/abortedAbsence.component';
import { CreateAbsenceComponent } from './Components/Absence/SubPages/CreateAbsence/createAbsence.component';
import { PastAbsenceComponent } from './Components/Absence/SubPages/PastAbsence/pastAbsence.component';
import { UpcommingAbsenceComponent } from './Components/Absence/SubPages/UpcommingAbsence/upcommingAbsence.component';


//Manage Components
import { DistrictsComponent } from './Components/Manage/SubPages/Districts/district.component';
import { AddDistrictComponent } from './Components/Manage/SubPages/Districts/addDistrict.component';
import { ManageComponent } from './Components/Manage/manage.component';
import { EmployeesComponent } from './Components/Manage/SubPages/Employees/employees.component';
import { AddEmployeesComponent } from './Components/Manage/SubPages/Employees/addEmployees.component';
import { SubstitutesComponent } from './Components/Manage/SubPages/Substitutes/substitutes.component';
import { AddSubstituteComponent } from './Components/Manage/SubPages/Substitutes/addSubstitute.component';
// import { SchoolSubListComponent } from './Components/Manage/SubPages/SchoolSubList/schoolSubList.component';
import { LeavesComponent } from './Components/Manage/SubPages/Leaves/leaves.component';
import { AddLeaveComponent } from './Components/Manage/SubPages/Leaves/addLeave.component';
import { AddLeaveRequestComponent } from './Components/Manage/SubPages/Leaves/LeavesRequests/addLeaveRequest.component';
import { ProfileComponent } from './Components/Manage/SubPages/Profile/profile.component';
import { OrganizationsComponent } from './Components/Manage/SubPages/Organization/organizations.component';
import { AddOrganizationComponent } from './Components/Manage/SubPages/Organization/addOrganization.component';
import { AuditLogComponent } from './Components/Audit-Log/audit-log.component';

//Reports Component
import { ReportsComponent } from './Components/Reports/reports.component';
import { DailyReportsComponent } from './Components/Reports/SubPages/DailyReports/dailyReports.component';
import { MonthlyReportsComponent } from './Components/Reports/SubPages/MonthlyReports/monthyReports.component';
import { ActivityReportsComponent } from './Components/Reports/SubPages/ActivityReports/activityReports.component';

//Permission Component
import { PermissionsComponent } from './Components/Permissions/permissions.component';

//Contact Component
import { ContactUsComponent } from './Components/Contact/contactUs.component'
import { SettingComponent } from './Components/Settings/settings.component';
//Jobs Component
import { JobComponent } from './Components/Job/job.component';
import { AvailableJobsComponent } from './Components/Job/SubPages/AvailableJobs/availableJobs.component';
import { MyJobsComponent } from './Components/Job/SubPages/MyJobs/myJobs.component';
import { PastJobsComponent } from './Components/Job/SubPages/PastJobs/pastJobs.component';

//Schools Component
import { SchoolsComponent } from './Components/Manage/SubPages/Schools/schools.component';
import { AddSchoolComponent } from './Components/Manage/SubPages/Schools/addSchool.component'

//TimeClock And TimeTracker Component
import { TimeClockComponent } from './Components/TimeClock/timeClock.component';
import { TimeTrackerComponent } from './Components/TimeTracker/timeTracker.component';

//Routing Authentication
import { AuthGuard } from './Authentication/auth.guard';
import { SubstituteCalendarComponent } from './Components/Dashboard/substitute-calendar.component';
import { SubstituteAvailabilityComponent } from './Components/Dashboard/substitute-availability.component';
import { PayRollComponent } from './Components/Payroll/payroll.component';
import { RolePermissionsComponent } from './Components/Permissions/RolePrmissions/role-permissions.component';
import { MySettingComponent } from './Components/Settings/MySettings/my-settings.component';
import { TrainingGuidesComponent } from './Components/TrainingGuides/training-guides.component';
import { ForgotPasswordComponent } from './Components/User/ForgotPassword/forgot-password.component';
import { SiteLayoutComponent } from './Components/_layout/site-layout/site-layout.component';
import { AppLayoutComponent } from './Components/_layout/app-layout/app-layout.component';
import { ResetPasswordComponent } from './Components/User/ResetPassword/reset-password.component';
import { SharedCalendarComponent } from './Components/Calendar/shared-calendar.component';
import { UserRoleType } from './Shared/enum';
import { SubscriptionComponent } from './Components/User/Unsubscribed/unsubscribed.component';


const appRoutes: Routes = [
    {
        path: '',
        component: SiteLayoutComponent,
        children: [
            { path: '', component: LoginComponent },
            { path: 'forgotPassword', component: ForgotPasswordComponent },
            { path: 'resetPassword', component: ResetPasswordComponent },
            { path: 'unsubscribed', component: SubscriptionComponent }
        ]
    },
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: 'home', component: HomeComponent, canActivate: [AuthGuard],
                data: {
                    path: '/home',
                    title: 'Home',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin] }
                }
            },
            {
                path: 'absence', component: absenceComponent, canActivate: [AuthGuard],
                data: {
                    path: '/absence',
                    title: 'Absence',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee] }
                },
                children: [{
                    path: '', redirectTo: 'createAbsence', pathMatch: 'full',
                    data: {
                        path: '/absence',
                        title: 'Absence',
                        type: 'main',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee] }
                    },
                },
                {
                    path: 'createAbsence', component: CreateAbsenceComponent,
                    data: {
                        path: '/absence/createAbsence',
                        title: 'Create Absence',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee] }
                    },
                },
                {
                    path: 'abortedAbsence', component: AbortedAbsenceComponent,
                    data: {
                        path: '/absence/abortedAbsence',
                        title: 'Aborted Absence',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee] }
                    }
                },
                {
                    path: 'pastAbsence', component: PastAbsenceComponent,
                    data: {
                        path: '/absence/pastAbsence',
                        title: 'Past Absence',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee] }
                    }
                },
                {
                    path: 'upcommingAbsence', component: UpcommingAbsenceComponent,
                    data: {
                        path: '/absence/upcommingAbsence',
                        title: 'Upcoming Absence',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee] }
                    }
                }
                ]
            },
            {
                path: 'manage', component: ManageComponent, canActivate: [AuthGuard],
                data: {
                    path: '/manage',
                    title: 'Manage',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin] }
                },
                children: [{
                    path: '', redirectTo: 'employees', pathMatch: 'full',
                    data: {
                        path: '/manage',
                        title: 'Organization',
                        type: 'main',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'organizations', component: OrganizationsComponent,
                    data: {
                        path: '/manage/organizations',
                        title: 'Organizations',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'organizations/addOrganization', component: AddOrganizationComponent,
                    data: {
                        path: '/manage/organizations/addOrganization',
                        title: 'Add Organization',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'districts', component: DistrictsComponent,
                    data: {
                        path: '/manage/districts',
                        title: 'Districts',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'district/addDistrict', component: AddDistrictComponent,
                    data: {
                        path: '/manage/district/addDistrict',
                        title: 'Add District',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'employees', component: EmployeesComponent,
                    data: {
                        path: '/manage/employees',
                        title: 'Employees',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'employees/addemployee', component: AddEmployeesComponent,
                    data: {
                        path: '/manage/employees/addemployee',
                        title: 'Add Employee',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'substitutes', component: SubstitutesComponent,
                    data: {
                        path: '/manage/substitutes',
                        title: 'Substitutes',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'substitutes/addSubstitute', component: AddSubstituteComponent,
                    data: {
                        path: '/manage/substitutes/addSubstitute',
                        title: 'Add Substitute',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'leave', component: LeavesComponent,
                    data: {
                        path: '/manage/leave',
                        title: 'Leave',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'leave/AddLeave', component: AddLeaveComponent,
                    data: {
                        path: '/manage/leave/AddLeave',
                        title: 'Add Leave',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'leave/AddLeaveRequest', component: AddLeaveRequestComponent,
                    data: {
                        path: '/manage/leave/AddLeaveRequest',
                        title: 'Add Leave Request',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'schools', component: SchoolsComponent,
                    data: {
                        path: '/manage/schools',
                        title: 'Schools',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'schools/AddSchool', component: AddSchoolComponent,
                    data: {
                        path: '/manage/schools/AddSchool',
                        title: 'Add School',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'substitutes/calendar', component: SubstituteCalendarComponent,
                    data: {
                        path: '/manage/substitutes/calendar',
                        title: 'Calendar',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin] }
                    }
                },
                ]
            },
            {
                path: 'viewjobs', component: JobComponent, canActivate: [AuthGuard],
                data: {
                    path: '/viewjobs',
                    title: 'Jobs',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.SuperAdmin, UserRoleType.Substitute] }
                },
                children: [{
                    path: '', redirectTo: 'availableJobs', pathMatch: 'full',
                    data: {
                        path: '/viewjobs',
                        title: 'Jobs',
                        type: 'main',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.Substitute, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'myJobs', component: MyJobsComponent,
                    data: {
                        path: '/viewjobs/myJobs',
                        title: 'My Jobs',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.Substitute, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'availableJobs', component: AvailableJobsComponent,
                    data: {
                        path: '/viewjobs/availableJobs',
                        title: 'Available Jobs',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.Substitute, UserRoleType.SuperAdmin] }
                    }
                },
                {
                    path: 'pastJobs', component: PastJobsComponent,
                    data: {
                        path: '/viewjobs/pastJobs',
                        title: 'Past Jobs',
                        type: 'sub',
                        icontype: 'apps',
                        collapse: 'components',
                        ab: 'account_circle',
                        permission: { roles: [UserRoleType.Substitute, UserRoleType.SuperAdmin] }
                    }
                }

                ]
            },
            {
                path: 'reports', component: ReportsComponent, canActivate: [AuthGuard],
                data: {
                    path: '/reports',
                    title: 'Report',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin] }
                }
                // children: [{ path: '', redirectTo: 'dailyReports', pathMatch: 'full', },
                // { path: 'dailyReports', component: DailyReportsComponent },
                // { path: 'monthlyReports', component: MonthlyReportsComponent },
                // { path: 'payRollReports', component: PayRollReportsComponent }
                // ]
            },
            {
                path: 'timetracker', component: TimeTrackerComponent, canActivate: [AuthGuard],
                data: {
                    path: '/timetracker',
                    title: 'Time Tracker',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin] }
                }
            },
            {
                path: 'timeclock', component: TimeClockComponent, canActivate: [AuthGuard],
                data: {
                    path: '/timeclock',
                    title: 'Time Clock',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee, UserRoleType.Substitute] }
                }
            },
            {
                path: 'settings', component: SettingComponent, canActivate: [AuthGuard],
                data: {
                    path: '/settings',
                    title: 'Settings',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Substitute, UserRoleType.Employee] }
                }
            },
            {
                path: 'mysettings', component: MySettingComponent, canActivate: [AuthGuard],
                data: {
                    path: '/mysettings',
                    title: 'My Settings',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee, UserRoleType.Substitute] }
                }
            },
            {
                path: 'profile', component: ProfileComponent, canActivate: [AuthGuard],
                data: {
                    path: '/profile',
                    title: 'Profile',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Substitute, UserRoleType.Employee] }
                }
            },
            {
                path: 'permissions', component: PermissionsComponent, canActivate: [AuthGuard],
                data: {
                    path: '/permissions',
                    title: 'Permissions',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.SuperAdmin] }
                }
            },
            {
                path: 'shared-calendar', component: SharedCalendarComponent, canActivate: [AuthGuard],
                data: {
                    path: '/shared-calendar',
                    title: 'Shared Calendar',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee, UserRoleType.Substitute] }
                }
            },
            {
                path: 'role/permissions/:id', component: RolePermissionsComponent, canActivate: [AuthGuard],
                data: {
                    path: '/role/permissions',
                    title: 'Permissions',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.SuperAdmin] }
                }
            },
            {
                path: 'contactUs', component: ContactUsComponent, canActivate: [AuthGuard],
                data: {
                    path: '/contactUs',
                    title: 'Contact Us',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee, UserRoleType.Substitute] }
                }
            },
            {
                path: 'calendar', component: SubstituteCalendarComponent, canActivate: [AuthGuard],
                data: {
                    path: '/calendar',
                    title: 'Calendar',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee, UserRoleType.Substitute] }
                }
            },
            {
                path: 'availability', component: SubstituteAvailabilityComponent, canActivate: [AuthGuard],
                data: {
                    path: '/availability',
                    title: 'Availability',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Substitute, UserRoleType.Employee] }
                }
            },
            {
                path: 'payroll', component: PayRollComponent, canActivate: [AuthGuard],
                data: {
                    path: '/payroll',
                    title: 'Payroll',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin] }
                }
            },
            {
                path: 'auditLog', component: AuditLogComponent, canActivate: [AuthGuard],
                data: {
                    path: '/auditLog',
                    title: 'Audit Log',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin] }
                }
            },
            {
                path: 'trainingGuide', component: TrainingGuidesComponent, canActivate: [AuthGuard],
                data: {
                    path: '/trainingGuide',
                    title: 'Training Guide',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.DistrictAdmin, UserRoleType.SchoolAdmin, UserRoleType.SuperAdmin, UserRoleType.Employee, UserRoleType.Substitute] }
                }
            }
        ]
    }];
export const routing: ModuleWithProviders =
    RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' });