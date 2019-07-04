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

  constructor(
    private dialogRef: MatDialog,
    private availabilityService: AvailabilityService,
    private _userSession: UserSession,
    private router: Router) { }

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
      displayEventTime : false,
      header: {
        left: 'today',
        center: 'prev, title, next',
        right: 'agendaDay, month, basicWeek'
      },
      defaultView: 'month',
      events: (start, end, timezone, callback) => {
        const model = {
          StartDate: moment(start).format('YYYY-MM-DD'),
          EndDate: moment(end).format('YYYY-MM-DD')
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
        
        if (end.isBefore(moment().add(1, 'hour').format()) || start.isBefore(moment().add(1, 'hour').format())) {
          $('#calendar').fullCalendar('unselect');
          alert('You can not set unavailability in past dates !');
          return false;
        }
        let forEndDate = moment(end).subtract(1, 'day').format();
        const availability = new UserAvailability();
        availability.startDate = moment(start).format('YYYY-MM-DD');
        availability.startTime = moment(start).format('hh:mm A');
        availability.endDate = moment(forEndDate).format('YYYY-MM-DD');
        availability.endTime = moment(end).format('hh:mm A');

        if (this.availabilityData && this.availabilityData.length > 0) {
          const booked = this.availabilityData.filter(t => moment(t['start']).format('YYYY-MM-DD') === availability.startDate);
          if (booked && booked.length > 0) {
            alert('You can not set unavailability for the date you are booked !');
            return false;
          }
        }
        const dialogRef = this.dialogRef.open(UnAvailabilityComponent,
          {
            panelClass: 'availability-edit-dialog',
            data: availability
          });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const model = result.availability;
            console.log({ save: model });
            this.availabilityService.create(model).subscribe(t => {
              this.reloadCalendar();
              this.getSubstituteAvailibiltySummary();
            });
          }
        });
      },
      eventDrop: event => {
      },
      eventResize: event => {
      },
      eventClick: event => {
        if(event.id == -1) {
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
                    this.availabilityService.put('availability/', result.id, result.availability).subscribe(t => {
                      this.reloadCalendar();
                      this.getSubstituteAvailibiltySummary();
                    });
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
