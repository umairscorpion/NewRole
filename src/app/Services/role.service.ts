import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { RestService } from './restService';
import { UserRole, RoleSummary } from '../Model/userRoles';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { Entity } from '../Model/entity';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable()
export class RoleService extends RestService<UserRole> {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService
  ) {
    super(httpClient);
  }

  getId(model: UserRole): number {
    return 1;
  }

  getUri(): string {
    return `${environment.apiUrl}roles`;
  }

  getInstance(): Entity {
    return new UserRole();
  }

  getSummaryList() {
    return this.httpClient
      .get<RoleSummary[]>(`${this.getUri()}/list/summary`)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: RoleSummary[]) => {
          return response.map(item => this.getInstance().deserialize(item));
        })
      );
  }

  deleteAll(ids: Array<number>): Observable<boolean> {
    return this.httpClient
      .put(`${this.getUri()}/bulk/delete`, ids)
      .pipe(
        catchError(this.errorHandler.handleError),
        map((response: any) => {
          return response.status === 200 && response.statusText === 'OK';
        })
      );
  }
}
