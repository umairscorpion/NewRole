import { Entity } from "./entity";
import { Time } from "@angular/common";
import * as moment from 'moment';

export class TimeClockFilter extends Entity {
startDate: string
endDate: string
fromDate: string;
toDate: string;
isDaysSelected: number
employeeName: string;
static initial() {
    const filters = new TimeClockFilter();
    filters.startDate = moment(new Date()).format('YYYY-MM-DD');
    filters.endDate = moment(new Date()).format('YYYY-MM-DD');
    filters.fromDate = moment(new Date()).format('YYYY-MM-DD');
    filters.toDate = moment(new Date()).format('YYYY-MM-DD');
    filters.isDaysSelected = 0;
    filters.employeeName = '';
    return filters;
  }
}