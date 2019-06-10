import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuditLog, AuditLogView, AuditLogAbsenceView, AuditFilter } from '../../Model/auditLog';
import { RestService } from '../restService';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuditLogService extends RestService<AuditLog> {

  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService) {
    super(httpClient);
  }

  getAuditView(model: AuditFilter) {
    return this.httpClient
      .post<AuditLogView[]>(`${environment.apiUrl}/audit/view`, model)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: AuditLogView[]) => {
          return response.map(item => new AuditLogView().deserialize(item));
        })
      );
  }

  getAbsencesAuditView(model: AuditFilter) {
    return this.httpClient
      .post<AuditLogAbsenceView[]>(`${environment.apiUrl}/audit/view/absence`, model)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: AuditLogAbsenceView[]) => {
          return response.map(item => new AuditLogAbsenceView().deserialize(item));
        })
      );
  }

  insertAbsencesLogView(model: AuditFilter) {
    return this.httpClient
      .post<AuditLogAbsenceView[]>(`${environment.apiUrl}/audit/view/insertAbsenceAuditLog`, model);
  }

  insertAuditLogout(model: AuditFilter) {
    return this.httpClient
      .post<AuditLogAbsenceView[]>(`${environment.apiUrl}/audit/view/insertAuditLogout`, model);
  }
}
