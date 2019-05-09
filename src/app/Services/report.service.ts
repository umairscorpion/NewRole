import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { ReportFilter } from '../Model/Report/report.filter';
import { ReportSummary } from '../Model/Report/report.summary';
import { environment } from '../../environments/environment';
import { Entity } from '../Model/entity';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { ReportDetail } from '../Model/Report/report.detail';
import { RestService } from './restService';
import { LeaveRequest } from '../Model/leaveRequest';

@Injectable()
export class ReportService extends RestService<any> {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService
  ) {
    super(httpClient);
  }

  getSummaryInstance(): Entity {
    return new ReportSummary();
  }

  getDetailInstance(): Entity {
    return new ReportDetail();
  }

  getLeaveRequestRecords(): Entity {
    return new LeaveRequest();
  }

  getSummary(filter: ReportFilter) {
    return this.httpClient
      .post<ReportSummary[]>(`${environment.apiUrl}/reports/summary`, filter)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: ReportSummary[]) => {
          return response.map(item => this.getSummaryInstance().deserialize(item));
        })
      );
  }

  getDetail(filter: ReportFilter) {
    return this.httpClient
      .post<ReportDetail[]>(`${environment.apiUrl}/reports/details`, filter)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: ReportDetail[]) => {
          return response.map(item => this.getDetailInstance().deserialize(item));
        })
      );
  }

  getPayrollDetails(filter: ReportFilter) {
    return this.httpClient
      .post<ReportDetail[]>(`${environment.apiUrl}/reports/payrollDetail`, filter)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: ReportDetail[]) => {
          return response.map(item => this.getDetailInstance().deserialize(item));
        })
      );
  }

  cancelAbsences(filter: ReportFilter) {
    return this.httpClient.post(`${environment.apiUrl}/reports/deleteAbsences`, filter);
  }

  getLeaveRequests(filter: ReportFilter) {
    return this.httpClient
      .post<LeaveRequest[]>(`${environment.apiUrl}/reports/getActivityReportDetail`, filter)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: LeaveRequest[]) => {
          return response.map(item => this.getLeaveRequestRecords().deserialize(item));
        })
      );
  }
}
