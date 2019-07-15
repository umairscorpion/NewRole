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
import { FormGroup, FormBuilder } from '@angular/forms';

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
  resources = new Array<any>();
  FilterForm: FormGroup;

  constructor(
    private availabilityService: AvailabilityService,
    private absenceService: AbsenceService,
    private _userSession: UserSession,
    private _dataContext: DataContext,
    private dialogRef: MatDialog,
    private fb: FormBuilder) {
      this.FilterForm = fb.group({
        organizationId: [0]
      });
     }

  ngOnInit() {
    this.loginedUserRole = this._userSession.getUserRoleId();
    this.containerEl = $('#calendar');
    this.loadAbsences();
    this.GetOrganizations(this._userSession.getUserDistrictId());
  }

  onSubmit(form: FormGroup) {
    const currentDate: Date = new Date();
    const startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - 6);
    const endDate = new Date();
    endDate.setMonth(currentDate.getMonth() + 6);
    let userId = this._userSession.getUserId();
    let districtId = this._userSession.getUserLevelId() === 4 ? 0 : this._userSession.getUserDistrictId();
    let organizationId = this._userSession.getUserLevelId() === 4 ? '' : this._userSession.getUserOrganizationId();
    let model = {
      startDate, endDate, userId, districtId, organizationId : this.FilterForm.value.organizationId == 0 ? '' : this.FilterForm.value.organizationId
    }
    this.absenceService.CalendarView('Absence/views/calendar', model).subscribe(
      (data: any) => {
        console.log({ absences: data });
        this.containerEl.fullCalendar('refetchResources');
          this.containerEl.fullCalendar('removeEvents');
          this.containerEl.fullCalendar('renderEvents', data, true);
      });
  }

  loadAbsences() {
    const currentDate: Date = new Date();
    const startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - 6);
    const endDate = new Date();
    endDate.setMonth(currentDate.getMonth() + 6);
    const userId = this._userSession.getUserId();
    const districtId = this._userSession.getUserLevelId() === 4 ? 0 : this._userSession.getUserDistrictId();
    const organizationId = this._userSession.getUserLevelId() === 4 ? '' : this._userSession.getUserOrganizationId();
    let model = {
      startDate, endDate, userId, districtId, organizationId
    }
    this.absenceService.CalendarView('Absence/views/calendar', model).subscribe(
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
          displayEventTime: false,
          header: {
            left: 'today',
            center: 'prev, title, next',
            right: 'agendaDay, month, basicWeek'
          },
          eventMouseover: function (data, event, view) {
            if (data.forEvents == "Events") {
              this.tooltip = '<div class="tooltiptopicevent" style="min-width: 150px; min-height: 70px; width:auto; height:auto; border-color:#808080; border-style: solid; background:#E0E0E0; position:absolute; z-index:10001; padding:10px 10px 10px 10px; line-height: 200%;">' + data.title + '</br>' + 'Full Day' + '</div>';
            }
            else {
              this.tooltip = '<div class="tooltiptopicevent" style="min-width: 150px; min-height: 70px; width:auto; height:auto; border-color:#808080; border-style: solid; background:#E0E0E0; position:absolute; z-index:10001; padding:10px 10px 10px 10px; line-height: 200%;">' + data.description + '</br>' + moment(data.start).format('hh:mm A') + ' - ' + moment(data.end).format('hh:mm A') + '</br>' + data.organizationName + '</div>';
            }
            $("body").append(this.tooltip);
            $(this).mouseover(function (e) {
              $(this).css('z-index', 10000);
              $('.tooltiptopicevent').fadeIn('500');
            }).mousemove(function (e) {
              $('.tooltiptopicevent').css('top', e.pageY + 10);
              $('.tooltiptopicevent').css('left', e.pageX + 20);
            });
          },
          eventMouseout: function (data, event, view) {
            $(this).css('z-index', 8);
            $('.tooltiptopicevent').remove();
          },
          eventResizeStart: function () {
            this.tooltip.hide()
          },
          eventDragStart: function () {
            this.tooltip.hide()
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
      if (this._userSession.getUserRoleId() == 2) {
        this.FilterForm.get('organizationId').setValue(this._userSession.getUserOrganizationId());
        this.FilterForm.controls['organizationId'].disable();
      }
    },
      error => <any>error);
  }

  reloadCalendar() {
    this.containerEl.fullCalendar('removeEvents');
    this.containerEl.fullCalendar('refetchEvents');
  }
}
