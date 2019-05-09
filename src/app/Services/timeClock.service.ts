import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Lookup } from '../Model/lookup';
import { environment } from '../../environments/environment';
import { Entity } from '../Model/entity';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { Observable } from 'rxjs';
import { RestService } from './restService';
import { User } from '../Model/user';
import { TimeClockFilter } from '../Model/timeclock.filter';
import { TimeClock } from '../Model/timeclock';

@Injectable()
export class TimeClockService {
    baseUrl = environment.apiUrl;
    constructor(private _http: HttpClient,
        protected errorHandler: ErrorHandlerService) { }
    clockin(url:string, userId:string): Observable<any> {
        return this._http.post(this.baseUrl + url, userId);
    }

    clockout(url:string, userId:string): Observable<any> {
        return this._http.post(this.baseUrl + url, userId);
    }

    break(url:string, userId:string): Observable<any> {
        return this._http.post(this.baseUrl + url, userId);
    }

    return(url:string, userId:string): Observable<any> {
        return this._http.post(this.baseUrl + url, userId);
    }

    TimeClockData(url: string): Observable<any> {
        return this._http.get(this.baseUrl + url);
    }

    checkTimeClockStatus(url: string): Observable<any> {
        return this._http.get(this.baseUrl + url);
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
    
}
