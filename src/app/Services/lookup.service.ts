import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Entity } from '../Model/entity';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { RestService } from './restService';
import { Lookup } from '../Model/lookup';
import { Observable } from 'rxjs';

@Injectable()
export class LookupService extends RestService<Lookup> {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService
  ) {
    super(httpClient);
  }

  getId(model: Lookup): number {
    return 1;
  }

  getUri(): string {
    return `/lookup`;
  }

  getInstance(): Entity {
    return new Lookup();
  }

  availabiltiyStatuses(): Observable<Lookup[]> {
    return this.httpClient
      .get<Lookup[]>(
        `${environment.apiUrl}/${this.getUri()}/availability-status`
      )
      .pipe(
        catchError(this.errorHandler.handleError),
        map((response: Lookup[]) => {
          return response;
        })
      );
  }
}
