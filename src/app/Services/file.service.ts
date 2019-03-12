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
import { SubstitutePreference } from '../Model/substitutePreference';
import { FileManager } from '../Model/FileSystem/fileManager.detail';

@Injectable()
export class FileService extends RestService<FileManager> {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService
  ) {
    super(httpClient);
  }

  uploadProfilePicture(model: FormData): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'fileSystem/uploadProfilePicture' , model, { reportProgress: true, observe: 'events' })
  }

  getProfilePic(model: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'fileSystem/getProfilePic', model, {responseType: 'blob' })
  }
}
