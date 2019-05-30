import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as $ from 'jquery';
import * as moment from 'moment';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { AvailabilityService } from '../../Services/availability.service';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-substitute-availability',
  templateUrl: 'substitute-availability.html',
  styleUrls: ['substitute-availability.scss']
})
export class SubstituteAvailabilityComponent implements OnInit {
  data: any;
  containerEl: JQuery;
  resources = new Array<any>();
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialog,
    private availabilityService: AvailabilityService) {
    const curr = new Date;
    const first = curr.getDate() - (curr.getDay() - 1);
    const last = first + 4;

    this.userForm = fb.group({
      date: [{ begin: new Date(curr.setDate(first)), end: new Date(curr.setDate(last)) }],
      availabilityStatusId: [-1],
      userId: [null]
    });
  }

  ngOnInit() {
    this.containerEl = $('#calendar');
    this.getData();
  }

  onSubmit(form: FormGroup) {
    const model = {
      'startDate': this.userForm.get('date').value['begin'],
      'endDate': this.userForm.get('date').value['end'],
      'availabilityStatusId': this.userForm.get('availabilityStatusId').value,
      'userId': this.userForm.get('userId').value
    };

    this.containerEl.fullCalendar('gotoDate', model.startDate);
    this.availabilityService.post('availability/substitutes', model).subscribe(
      (availabilities: any) => {
        this.resources = this.getResources(availabilities[0].resources);
        this.containerEl.fullCalendar('refetchResources');
        this.containerEl.fullCalendar('removeEvents');
        this.containerEl.fullCalendar('renderEvents', availabilities, true);
      });
  }

  getData() {
    const model = {
      'startDate': this.userForm.get('date').value['begin'],
      'endDate': this.userForm.get('date').value['end'],
      'availabilityStatusId': this.userForm.get('availabilityStatusId').value,
      'userId': this.userForm.get('userId').value
    };
    this.containerEl.fullCalendar('removeEvents');
    this.availabilityService.post('availability/substitutes', model).subscribe(
      (result: any) => {
        this.data = result;
        this.resources = this.getResources(result[0].resources);
        this.containerEl.fullCalendar({
          resourceAreaWidth: 230,
          slotDuration: '24:00:00',
          firstDay: 1,
          weekends: false,
          allDaySlot: false,
          customButtons: {
            nextWeekBtn: {
              text: 'Next Week',
              click: () => {
                this.containerEl.fullCalendar('next');
                const curr = new Date(moment(this.containerEl.fullCalendar('getDate')).format());
                const first = curr.getDate() - (curr.getDay() - 1);
                const last = first + 4;
                const weekStart = new Date(curr.setDate(first));
                const weekEnd = new Date(curr.setDate(last));
                const subsAvailable = {
                  'startDate': weekStart,
                  'endDate': weekEnd,
                  'availabilityStatusId': -1,
                  'userId': ''
                };
                this.availabilityService.post('availability/substitutes', subsAvailable).subscribe(
                  (availabilities: any) => {
                    this.resources = this.getResources(availabilities[0].resources);
                    this.containerEl.fullCalendar('removeEvents');
                    this.containerEl.fullCalendar('renderEvents', availabilities, true);
                  });
              }
            }
          },
          header: {
            left: '',
            center: '',
            right: ''
          },
          footer: {
            left: '',
            right: 'nextWeekBtn',
          },
          viewRender: (view, element) => {
            element.find('.fc-head .fc-time-area th.fc-widget-header').each(function () {
              const date = moment($(this).data('date'));
              $(this).html('<span>' + date.format('ddd') + '</span><br><span>' + date.format('M/D/YYYY') + '</span>');
            });
          },
          resourceLabelText: 'Substitute',
          defaultView: 'timelineWeek',
          resources: this.resources,
          events: result,
          resourceRender: function (resourceObj, labelTds, bodyTds) {
            // tslint:disable-next-line:max-line-length
            labelTds.prepend(`<img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" width="30" height="30" class="substitute-availability-profile-image">`);
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

  getResources(resources) {
    const resArr = [];
    resources.filter(function (item) {
      const i = resArr.findIndex(x => (x.id === item.id && x.title === item.title && x.profilePicUrl === item.profilePicUrl));
      if (i <= -1) {
        resArr.push(item);
      }
      return null;
    });
    return resArr;
  }
}
