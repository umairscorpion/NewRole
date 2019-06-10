import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Entity } from '../Model/entity';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { Observable } from 'rxjs';
import { RestService } from './restService';
import { TimeClockFilter } from '../Model/timeclock.filter';
import { TimeClock } from '../Model/timeclock';

@Injectable()
export class TimeClockService extends RestService<TimeClock> {

  constructor(
    private _http: HttpClient,
    protected errorHandler: ErrorHandlerService) {
    super(_http);
  }

  clockin(url: string, userId: string): Observable<any> {
    return this._http.post(environment.apiUrl + url, userId);
  }

  clockout(url: string, userId: string): Observable<any> {
    return this._http.post(environment.apiUrl + url, userId);
  }

  break(url: string, userId: string): Observable<any> {
    return this._http.post(environment.apiUrl + url, userId);
  }

  return(url: string, userId: string): Observable<any> {
    return this._http.post(environment.apiUrl + url, userId);
  }

  TimeClockData(url: string): Observable<any> {
    return this._http.get(environment.apiUrl + url);
  }

  checkTimeClockStatus(url: string): Observable<any> {
    return this._http.get(environment.apiUrl + url);
  }

  //Get data by Filters
  getSummaryInstance(): Entity {
    return new TimeClock();
  }
  getTimeClockSummary(filter: TimeClockFilter) {
    return this._http
      .post<TimeClock[]>(`${environment.apiUrl}/Time/timeclockdatawithfilter`, filter)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: TimeClock[]) => {
          return response.map(item => this.getSummaryInstance().deserialize(item));
        })
      );
  }

  getTimeTrackerSummary(filter: TimeClockFilter) {
    return this._http
      .post<TimeClock[]>(`${environment.apiUrl}/Time/gettimetrackerdata`, filter)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: TimeClock[]) => {
          return response.map(item => this.getSummaryInstance().deserialize(item));
        })
      );
  }

  getTimeTrackerDetailsWithFilter(filter: TimeClockFilter) {
    return this._http
      .post<TimeClock[]>(`${environment.apiUrl}/Time/timetrackerdatawithfilter`, filter)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: TimeClock[]) => {
          return response.map(item => this.getSummaryInstance().deserialize(item));
        })
      );
  }
}
