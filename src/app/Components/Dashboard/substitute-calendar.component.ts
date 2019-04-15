import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import * as $ from 'jquery';
import * as moment from 'moment';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { AvailabilityService } from 'src/app/Services/availability.service';
import { MatDialog } from '@angular/material';
import { UnAvailabilityComponent } from './unavailability/unavailability.component';
import { UserAvailability } from 'src/app/Model/userAvailability';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-substitute-calendar',
  templateUrl: 'substitute-calendar.html'
})
export class SubstituteCalendarComponent implements OnInit {
  containerEl: JQuery;
  doOpen = true;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialog,
    private availabilityService: AvailabilityService
  ) {

  }

  ngOnInit() {
    this.containerEl = $('#calendar');
    this.loadUnavailability();
  }

  loadUnavailability() {
    this.availabilityService.getAll().subscribe(
      (data: any) => {
        console.log({ Availability: data });
        this.containerEl.fullCalendar({
          editable: false,
          eventDurationEditable: true,
          aspectRatio: 1.8,
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
            const availability = new UserAvailability();
            availability.startDate = moment(start).format('YYYY-MM-DD');
            availability.startTime = moment(start).format('hh:mm A');
            availability.endDate = moment(end).format('YYYY-MM-DD');
            availability.endTime = moment(end).format('hh:mm A');
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
                });
              }
            });
          },
          eventDrop: event => {
          },
          eventResize: event => {
          },
          eventClick: event => {
            if (this.doOpen) {
              this.dialogRef.openDialogs.pop();
              this.availabilityService
                .get(`availability/${event.id}`)
                .subscribe((availability: any) => {
                  const dialogRef = this.dialogRef.open(
                    UnAvailabilityComponent,
                    {
                      panelClass: 'availability-edit-dialog',
                      data: availability
                    }
                  );
                  this.doOpen = false;
                  dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                      console.log({ result });
                      if (result.action === 'Submit') {
                        this.availabilityService.put('availability/', result.id, result.availability).subscribe(t => {
                          this.reloadCalendar();
                        });
                      } else if (result.action === 'Delete') {
                        this.availabilityService.delete('availability/', result.id).subscribe(t => {
                          this.reloadCalendar();
                        });
                      }
                      this.doOpen = true;
                    }
                  });
                });
            }
          }
        });
      },
      error => {
      }
    );
  }

  reloadCalendar() {
    this.availabilityService.getAll().subscribe((data: any) => {
      this.containerEl.fullCalendar('removeEvents');
      this.containerEl.fullCalendar('renderEvents', data, true);
    });
  }
}
