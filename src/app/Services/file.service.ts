import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler/error-handler.service';
import { Observable } from 'rxjs';
import { RestService } from './restService';
import { FileManager } from '../Model/FileSystem/fileManager.detail';
import { catchError, map } from 'rxjs/operators';
import { Entity } from '../Model/entity';

@Injectable()
export class FileService extends RestService<FileManager> {
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: ErrorHandlerService
  ) {
    super(httpClient);
  }

  getInstance(): Entity {
    return new FileManager();
  }

  uploadProfilePicture(model: FormData): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'fileSystem/uploadProfilePicture', model, { reportProgress: true, observe: 'events' })
  }

  getProfilePic(model: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'fileSystem/getProfilePic', model, { responseType: 'blob' });
  }

  getFile(model: any): Observable<any> {
    return this.httpClient
      .post<FileManager[]>(`${environment.apiUrl}/fileSystem/getFiles`, model)
      .pipe(catchError(this.errorHandler.handleError),
        map((response: FileManager[]) => {
          return response.map(item => this.getInstance().deserialize(item));
        })
      );
  }

  addFile(url: string, model: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + url, model);
  }

  deleteFile(url: string, model: any): Observable<any> {
    return this.httpClient.patch(environment.apiUrl + url, model);
  }

}
