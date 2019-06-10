import { Injectable } from '@angular/core';
import { Lookup } from '../Model/lookup';
import { environment } from '../../environments/environment';
import { Entity } from '../Model/entity';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { Observable } from 'rxjs';
import { RestService } from './restService';
import { User } from '../Model/user';
import { SubstitutePreference } from '../Model/substitutePreference';

@Injectable()
export class ProfileService extends RestService<User> {

  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService) {
    super(httpClient);
  }

  getSubstituteCategoryInstance(): Entity {
    return new Lookup();
  }

  getCategory(userId: string, searchText: string): Observable<Lookup[]> {
    return this.httpClient
      .get<Lookup[]>(`${environment.apiUrl}/user/favoriteSubstituteCategory` + '/' + userId + '/' + searchText);
  }

  InsertCategory(subCategory: SubstitutePreference) {
    return this.httpClient
      .post<number>(`${environment.apiUrl}/user/insertPreferredSSubstituteCategory`, subCategory);
  }
}
