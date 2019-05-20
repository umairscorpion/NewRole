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


const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    {
        path: 'absence', component: absenceComponent, canActivate: [AuthGuard],
        children: [{ path: '', redirectTo: 'createAbsence', pathMatch: 'full' },
        { path: 'createAbsence', component: CreateAbsenceComponent },
        { path: 'abortedAbsence', component: AbortedAbsenceComponent },
        { path: 'pastAbsence', component: PastAbsenceComponent },
        { path: 'upcommingAbsence', component: UpcommingAbsenceComponent }
        ]
    },
    {
        path: 'manage', component: ManageComponent, canActivate: [AuthGuard],
        children: [{ path: '', redirectTo: 'organizations', pathMatch: 'full' },
        { path: 'organizations', component: OrganizationsComponent },
        { path: 'organizations/addOrganization', component: AddOrganizationComponent },
        { path: 'districts', component: DistrictsComponent },
        { path: 'district/addDistrict', component: AddDistrictComponent },
        { path: 'employees', component: EmployeesComponent },
        { path: 'employees/addemployee', component: AddEmployeesComponent },
        { path: 'substitutes', component: SubstitutesComponent },
        { path: 'substitutes/addSubstitute', component: AddSubstituteComponent },
        { path: 'leave', component: LeavesComponent },
        { path: 'leave/AddLeave', component: AddLeaveComponent },
        { path: 'leave/AddLeaveRequest', component: AddLeaveRequestComponent },
        { path: 'schools', component: SchoolsComponent },
        { path: 'schools/AddSchool', component: AddSchoolComponent },
        { path: 'substitutes/calendar', component: SubstituteCalendarComponent },

        ]
    },
    {
        path: 'viewjobs', component: JobComponent, canActivate: [AuthGuard],
        children: [{ path: '', redirectTo: 'availableJobs', pathMatch: 'full' },
        { path: 'myJobs', component: MyJobsComponent },
        { path: 'availableJobs', component: AvailableJobsComponent },
        { path: 'pastJobs', component: PastJobsComponent }

        ]
    },
    {
        path: 'reports', component: ReportsComponent, canActivate: [AuthGuard]
        // children: [{ path: '', redirectTo: 'dailyReports', pathMatch: 'full' },
        // { path: 'dailyReports', component: DailyReportsComponent },
        // { path: 'monthlyReports', component: MonthlyReportsComponent },
        // { path: 'payRollReports', component: PayRollReportsComponent }
        // ]
    },
    { path: 'timetracker', component: TimeTrackerComponent, canActivate: [AuthGuard] },
    { path: 'timeclock', component: TimeClockComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingComponent, canActivate: [AuthGuard] },
    { path: 'mysettings', component: MySettingComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'permissions', component: PermissionsComponent, canActivate: [AuthGuard] },
    { path: 'role/permissions/:id', component: RolePermissionsComponent, canActivate: [AuthGuard] },
    { path: 'contactUs', component: ContactUsComponent, canActivate: [AuthGuard] },
    { path: 'calendar', component: SubstituteCalendarComponent, canActivate: [AuthGuard] },
    { path: 'availability', component: SubstituteAvailabilityComponent, canActivate: [AuthGuard] },
    { path: 'payroll', component: PayRollComponent, canActivate: [AuthGuard] },
    { path: 'auditLog', component: AuditLogComponent, canActivate: [AuthGuard] },
    { path: 'trainingGuide', component: TrainingGuidesComponent, canActivate: [AuthGuard] }
];

export const routing: ModuleWithProviders =
    RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'});