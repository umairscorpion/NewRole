import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from './restService';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { Entity } from '../Model/entity';
import { User, UserSummary } from '../Model/user';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService extends RestService<User> {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService) {
    super(httpClient);
  }

  getId(model: User): number {
    return 1;
  }

  getUri(): string {
    return `${environment.apiUrl}user`;
  }

  getSummaryList(districtId: number) {
    return this.httpClient
      .get<UserSummary[]>(`${this.getUri()}/list/summary/${districtId}`)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: UserSummary[]) => {
          return response.map(item => this.getInstance().deserialize(item));
        })
      );
  }

  create(model: User) {
    return this.post(`user/insertUser`, model);
  }

  update(model: User) {
    return this.post(`user/updateUser`, model);
  }

  deleteAll(ids: Array<string>): Observable<boolean> {
    return this.httpClient
      .put(`${this.getUri()}/bulk/delete`, ids)
      .pipe(
        catchError(this.errorHandler.handleError),
        map((response: any) => {
          return response.status === 200 && response.statusText === 'OK';
        })
      );
  }

  getInstance(): Entity {
    return new User();
  }
}
