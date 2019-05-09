import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { Observable } from 'rxjs';
import { RestService } from './restService';
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
    return this.httpClient.post(environment.apiUrl + 'fileSystem/uploadProfilePicture', model, { reportProgress: true, observe: 'events' })
  }

  getProfilePic(model: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'fileSystem/getProfilePic', model, { responseType: 'blob' });
  }

  getSubstituteFiles(url: string): Observable<any> {
    return this.httpClient.get(environment.apiUrl + url);
  }

  addSubstituteFiles(url: string, model: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + url, model);
  }

  deleteSubstituteFiles(url: string, model: any): Observable<any> {
    return this.httpClient.patch(environment.apiUrl + url, model);
  }

}
