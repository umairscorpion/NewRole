import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { Lookup } from '../Model/lookup';
import { environment } from 'src/environments/environment';
import { Entity } from '../Model/entity';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { Observable } from '../../../node_modules/rxjs';
import { RestService } from './restService';
import { User } from '../Model/user';
import { SubstitutePreference } from '../Model/substitutePreference';
import { LeaveType } from '../Model/leaveType';
import { LeaveRequest } from '../Model/leaveRequest';

@Injectable()
export class AbsenceService extends RestService<User> {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService
  ) {
    super(httpClient);
  }

  getLeaveTypeRecords(): Entity {
    return new LeaveType();
  }

  getLeaveRequestRecords(): Entity {
    return new LeaveRequest();
  }

  insertLeaveType (leaveModel: any) {
    return this.httpClient
      .post<number>(`${environment.apiUrl}/Leave/insertLeaveType`, leaveModel);
  }

  getLeaveType(districtId: number, organizationId: string) {
     return this.httpClient
      .get<LeaveType[]>(environment.apiUrl + "Leave/getLeaveTypes"+ '/' + districtId + '/' + organizationId)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: LeaveType[]) => {
          return response.map(item => this.getLeaveTypeRecords().deserialize(item));
        })
      );
  }

  getLeaveRequests(districtId: number, organizationId: string) {
    return this.httpClient
     .get<LeaveRequest[]>(environment.apiUrl + "Leave/getLeaveRequests/"+ '/' + districtId + '/' + organizationId)
     .pipe(catchError(this.errorHandler.handleError),
       map((response: LeaveRequest[]) => {
         return response.map(item => this.getLeaveRequestRecords().deserialize(item));
       })
     );
 }
}
