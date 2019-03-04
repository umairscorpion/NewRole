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

@Injectable()
export class UserService extends RestService<User> {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService
  ) {
    super(name);
  }

  getSubstituteCategoryInstance(): Entity {
    return new Lookup();
  }

  getCategory(userId: string, searchText : string) :Observable<Lookup[]> {
    return this.httpClient
      .get<Lookup[]>(`${environment.apiUrl}/user/favoriteSubstituteCategory` + '/' + userId + '/' +  searchText);
  }
}
