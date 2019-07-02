import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as moment from 'moment';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { AvailabilityService } from '../../Services/availability.service';
import { ReportDetail } from 'src/app/Model/Report/report.detail';
import { UserSession } from 'src/app/Services/userSession.service';
import { AbsenceService } from 'src/app/Services/absence.service';
import { MatDialog } from '@angular/material';
import { EventAddComponent } from './event-add/event-add.component';
import { DataContext } from '../../Services/dataContext.service';

@Component({
  selector: 'app-shared-calendar',
  templateUrl: 'shared-calendar.component.html'
})
export class SharedCalendarComponent implements OnInit {
  containerEl: JQuery;
  substituteAvailibiltySummary: any;
  doOpen = true;
  date: string = moment().format('dddd, MM/DD/YYYY');
  todayTotalAbsenceDetails: ReportDetail[] = Array<ReportDetail>();
  loginedUserRole = 0;
  Organizations: any;

  constructor(
    private availabilityService: AvailabilityService,
    private absenceService: AbsenceService,
    private _userSession: UserSession,
    private _dataContext: DataContext,
    private dialogRef: MatDialog) { }

  ngOnInit() {
    this.loginedUserRole = this._userSession.getUserRoleId();
    this.containerEl = $('#calendar');
    this.loadAbsences();
    this.GetOrganizations(this._userSession.getUserDistrictId());
  }

  loadAbsences() {
    const currentDate: Date = new Date();
    const startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - 6);
    const endDate = new Date();
    endDate.setMonth(currentDate.getMonth() + 6);
    const userId = this._userSession.getUserId();
    const campusId = this._userSession.getUserLevelId() === 1 ? '-1' : this._userSession.getUserOrganizationId();
    this.absenceService.CalendarView(startDate, endDate, userId, campusId).subscribe(
      (data: any) => {
        console.log({ absences: data });
        this.containerEl.fullCalendar({
          editable: false,
          eventDurationEditable: true,
          aspectRatio: 2,
          scrollTime: '00:00',
          selectable: true,
          slotDuration: '00:30:00',
          allDaySlot: false,
          header: {
            left: 'today',
            center: 'prev, title, next',
            right: 'agendaDay, month, basicWeek'
          },
          defaultView: 'month',
          events: data,
          eventRender: (event, element) => {
          },
          select: (start, end, jsEvent, view, resource) => {
            if (end.isBefore(moment().add(1, 'hour').format())) {
              $('#calendar').fullCalendar('unselect');
              alert('You can not set unavailability in past dates !');
              return false;
            }
            const event = {};
            event['startDate'] = moment(start).format('YYYY-MM-DD');
            event['startTime'] = moment(start).format('hh:mm A');
            event['endDate'] = moment(start).format('YYYY-MM-DD');
            event['endTime'] = moment(end).format('hh:mm A');
            const dialogRef = this.dialogRef.open(EventAddComponent,
              {
                panelClass: 'availability-edit-dialog',
                data: event
              });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                const model = result.event;
                this.availabilityService.createEvent(model).subscribe(t => {
                  this.loadAbsences();
                });
              }
            });
          },
          eventDrop: event => {
          },
          eventResize: event => {
          }
        });
      },
      error => {
      }
    );
  }

  GetOrganizations(DistrictId: number): void {
    this._dataContext.getById('School/getOrganizationsByDistrictId', DistrictId).subscribe((data: any) => {
      this.Organizations = data;
    },
      error => <any>error);
  }

  reloadCalendar() {
    this.containerEl.fullCalendar('removeEvents');
    this.containerEl.fullCalendar('refetchEvents');
  }
}
