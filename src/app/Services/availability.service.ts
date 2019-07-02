import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Entity } from '../Model/entity';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { RestService } from './restService';
import { UserAvailability } from '../Model/userAvailability';

@Injectable()
export class AvailabilityService extends RestService<UserAvailability> {

  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService) {
    super(httpClient);
  }

  getInstance(): Entity {
    return new UserAvailability();
  }

  getAll(model: any) {
    return this.httpClient
      .post<UserAvailability[]>(environment.apiUrl + 'availability/events', model)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: UserAvailability[]) => {
          return response.map(item => this.getInstance().deserialize(item));
        })
      );
  }

  create(model: any): any {
    return this.httpClient.post(`${environment.apiUrl}availability`, model);
  }

  createEvent(model: any): any {
    return this.httpClient.post(`${environment.apiUrl}event`, model);
  }

  CheckSubstituteAvailability(model: any): any {
    return this.httpClient.post(`${environment.apiUrl}availability/checkSubstituteAvailability`, model);
  }
}
