import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { RestService } from './restService';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { Entity } from '../Model/entity';
import { User, UserSummary } from '../Model/user';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { UserSession } from './userSession.service';


@Injectable()
export class UsersService extends RestService<User> {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService,
    private _UserSession: UserSession
  ) {
    super(httpClient);
  }

  getId(model: User): number {
    return 1;
  }

  getUri(): string {
    return `${environment.apiUrl}user`;
  }

  getSummaryList() {
    return this.httpClient
      .get<UserSummary[]>(`${this.getUri()}/list/summary`)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: UserSummary[]) => {
          return response.map(item => this.getInstance().deserialize(item));
        })
      );
  }

  getInstance(): Entity {
    return new User();
  }
}
