import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Entity } from '../Model/entity';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { RestService } from './restService';
import { SubzzVersion } from '../Model/subzzVersion';

@Injectable()
export class SettingsService extends RestService<SubzzVersion> {

  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService) {
    super(httpClient);
  }

  getInstance(): Entity {
    return new SubzzVersion();
  }

  getVersionUpdate() {
    return this.httpClient.get<SubzzVersion>(`${environment.apiUrl}Setting/version`);
  }
}
