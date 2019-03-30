import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Entity } from '../Model/entity';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { RestService } from './restService';
import { Observable } from 'rxjs';
import { UserAvailability } from '../Model/userAvailability';

@Injectable()
export class AvailabilityService extends RestService<UserAvailability> {

  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService
  ) {
    super(httpClient);
  }

  getInstance(): Entity {
    return new UserAvailability();
  }


  getAll() {
    return this.httpClient
      .get<UserAvailability[]>(environment.apiUrl + 'availability')
      .pipe(catchError(this.errorHandler.handleError),
        map((response: UserAvailability[]) => {
          return response.map(item => this.getInstance().deserialize(item));
        })
      );
  }

  create(model: any): any {
    return this.httpClient.post(`${environment.apiUrl}availability`, model);
  }
}
