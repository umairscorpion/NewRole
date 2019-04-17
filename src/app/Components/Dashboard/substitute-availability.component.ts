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


@Component({
  selector: 'app-substitute-availability',
  templateUrl: 'substitute-availability.html',
  styleUrls: ['substitute-availability.scss']
})
export class SubstituteAvailabilityComponent implements OnInit {
  data: any;
  containerEl: JQuery;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialog,
    private availabilityService: AvailabilityService
  ) {

  }

  ngOnInit() {
    this.containerEl = $('#calendar');
    this.getData();
  }

  getData() {
    const model = { 'StartDate': '' };
    this.containerEl.fullCalendar('removeEvents');
    this.availabilityService.post('availability/substitutes', model).subscribe(
      (result: any) => {
        this.data = result;
        this.containerEl.fullCalendar({
          // resourceAreaWidth: 230,
          // editable: true,
          // aspectRatio: 1.5,
          // scrollTime: '00:00',
          // header: {
          //   left: 'promptResource today prev,next',
          //   center: 'title',
          //   right: 'timelineWeek,customWeek,basicWeek'
          // },
          // firstDay: 1,
          // defaultView: 'customWeek',
          // views: {
          //   customWeek: {
          //     type: 'timeline',
          //     duration: { weeks: 1 },
          //     slotDuration: { days: 1 },
          //     buttonText: 'Custom Week'
          //   }
          // },
          // resourceLabelText: 'Substitute',
          // resources: result[0].resources,
          // events: result,
          resourceAreaWidth: 230,
          slotDuration: '24:00:00',
          firstDay: 1,
          weekends: false,
          allDaySlot: false,
          customButtons: {
            previousWeekBtn: {
              text: 'Previous Week',
              click: function () {
                alert('clicked!');
              }
            },
            nextWeekBtn: {
              text: 'Next Week',
              click: function () {
                alert('clicked!');
              }
            }
          },
          header: {
            left: 'prev, next',
            center: '', // 'title',
            right: '' // 'timelineDay, timelineWeek, month'
          },
          views: {
            month: {
              columnHeaderFormat: 'dddd' // set format for month here
            },
            timelineWeek: {
              columnHeaderFormat: 'ddd d/M/Y' // set format for week here
            },
            day: {
              columnHeaderFormat: 'dddd' // set format for day here
            }
          },
          resourceLabelText: 'Substitute',
          defaultView: 'timelineWeek',
          resources: result[0].resources,
          events: result,
          resourceRender: function (resourceObj, labelTds, bodyTds) {
          },
          eventRender: (event, element) => {
            element.find('.fc-content').html('<div class="substitute-is-' + event.title.toLowerCase() + '"></div>');
          }
        });
      },
      error => {
      }
    );
  }
}
