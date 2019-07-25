import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as moment from 'moment';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { AvailabilityService } from '../../Services/availability.service';
import { MatDialog } from '@angular/material';
import { UnAvailabilityComponent } from './unavailability/unavailability.component';
import { UserAvailability } from '../../Model/userAvailability';
import { ReportDetail } from '../../Model/Report/report.detail';
import { UserSession } from '../../Services/userSession.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-substitute-calendar',
  templateUrl: 'substitute-calendar.html'
})
export class SubstituteCalendarComponent implements OnInit {
  containerEl: JQuery;
  substituteAvailibiltySummary: any;
  doOpen = true;
  date: string = moment().format('dddd, MM/DD/YYYY');
  todayTotalAbsenceDetails: ReportDetail[] = Array<ReportDetail>();
  loginedUserRole = 0;
  availabilityData = [];
  tooltip: any;

  constructor(
    private dialogRef: MatDialog,
    private availabilityService: AvailabilityService,
    private _userSession: UserSession,
    private router: Router,
    private notifier: NotifierService) { }

  ngOnInit() {
    this.loginedUserRole = this._userSession.getUserRoleId();
    this.containerEl = $('#calendar');
    const moment = $('#calendar').fullCalendar('getDate');
    this.loadUnavailability();
    this.getSubstituteAvailibiltySummary();
  }

  loadUnavailability() {
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
        if (data.allDay) {
          this.tooltip = '<div class="tooltiptopicevent" style="min-width: 150px; min-height: 70px; width:auto; height:auto; border-color:#808080; border-style: solid; background:#E0E0E0; position:absolute; z-index:10001; padding:10px 10px 10px 10px; line-height: 200%;">' + data.description + '</br>' + 'Full Day' + '</div>';
        }
        else {
          if (data.id == -1) {
            this.tooltip = '<div class="tooltiptopicevent" style="min-width: 150px; min-height: 70px; width:auto; height:auto; border-color:#808080; border-style: solid; background:#E0E0E0; position:absolute; z-index:10001; padding:10px 10px 10px 10px; line-height: 200%;">' + data.description + '</br>' + moment(data.start).format('hh:mm A') + ' - ' + moment(data.end).format('hh:mm A') + '</br>' + data.organizationName + '</div>';
          }
          else {
            this.tooltip = '<div class="tooltiptopicevent" style="min-width: 150px; min-height: 70px; width:auto; height:auto; border-color:#808080; border-style: solid; background:#E0E0E0; position:absolute; z-index:10001; padding:10px 10px 10px 10px; line-height: 200%;">' + data.description + '</br>' + moment(data.start).format('hh:mm A') + ' - ' + moment(data.end).format('hh:mm A') + '</div>';
          }
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
      events: (start, end, timezone, callback) => {
        const model = {
          StartDate: moment(start).format('YYYY-MM-DD'),
          EndDate: moment(end).format('YYYY-MM-DD'),
          UserRoleId: this.loginedUserRole
        };
        this.availabilityService.getAll(model).subscribe((data: any) => {
          this.containerEl.fullCalendar('removeEvents');
          this.availabilityData = data;
          callback(data);
        });
      },

      eventRender: (event, element) => {
      },

      select: (start, end, jsEvent, view, resource) => {
        if (this.loginedUserRole !== 4) { // Substitute = 4
          return;
        }
        if (moment(start, 'YYYY-MM-DD').isSameOrBefore(moment().format('YYYY-MM-DD'))) {
          $('#calendar').fullCalendar('unselect');
          this.notifier.notify('error', 'You can not set unavailability in past dates !');
          return false;
        }
        const availability = new UserAvailability();
        availability.startDate = moment(start).format('YYYY-MM-DD');
        availability.startTime = moment(start).format('hh:mm A');
        availability.endDate = moment(end).subtract(1, 'day').format('YYYY-MM-DD');
        availability.endTime = moment(end).format('hh:mm A');

        const dialogRef = this.dialogRef.open(UnAvailabilityComponent,
          {
            panelClass: 'availability-edit-dialog',
            data: availability
          });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.reloadCalendar();
            this.getSubstituteAvailibiltySummary();
          }
        });
      },

      eventDrop: event => {
      },

      eventResize: event => {
      },

      eventClick: event => {
        if (event.id == -1) {
          return false;
        }
        if (this.doOpen) {
          this.dialogRef.openDialogs.pop();
          this.availabilityService.get(`availability/${event.id}`).subscribe((availability: any) => {
            const dialogRef = this.dialogRef.open(
              UnAvailabilityComponent,
              {
                panelClass: 'availability-edit-dialog',
                data: availability
              }
            );
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                console.log({ result });
                if (result.action === 'Submit') {
                  this.reloadCalendar();
                  this.getSubstituteAvailibiltySummary();
                } else if (result.action === 'Delete') {
                  this.availabilityService.delete('availability/', result.id).subscribe(t => {
                    this.reloadCalendar();
                    this.getSubstituteAvailibiltySummary();
                  });
                }
                this.doOpen = true;
              }
            });
          });
        }
      }
    });
  }

  getSubstituteAvailibiltySummary() {
    // const model = {
    //   };
    // this.availabilityService.post('availability/substitutes/summary', model).subscribe((availabilities: any) => {
    //   this.substituteAvailibiltySummary = availabilities;
    // });
    // const filters = ReportFilter.initial();
    // this.date = moment(filters.fromDate).format('dddd, MM/DD/YYYY');
    // this.reportService.getDetail(filters).subscribe((details: ReportDetail[]) => {
    //   this.todayTotalAbsenceDetails = details;
    // });
  }

  reloadCalendar() {
    this.containerEl.fullCalendar('removeEvents');
    this.containerEl.fullCalendar('refetchEvents');
  }

  jumpToReport() {
    this.router.navigate(['/reports']);
  }
}
