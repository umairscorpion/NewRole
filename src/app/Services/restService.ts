import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';

export abstract class RestService<T> {
    private baseUrl = environment.apiUrl;

    constructor(
        protected httpClient: HttpClient) { }

    get(url: any): Observable<any> {
        return this.httpClient.get(this.baseUrl + url);
    }

    getById(url: string, Id: number): Observable<T> {
        return this.httpClient.get<T>(this.baseUrl + url + "/" + Id);
    }

    post(url: string, model: any): Observable<T> {
        return this.httpClient.post<T>(this.baseUrl + url, model);
    }

    Patch(url: string, model: any): Observable<T> {
        return this.httpClient.patch<T>(this.baseUrl + url, model);
    }

    put(url: string, id: number, model: any): Observable<T> {
        return this.httpClient.put<T>(this.baseUrl + url + id, model);
    }

    delete(url: string, id: number): Observable<T> {
        return this.httpClient.delete<T>(this.baseUrl + url + id);
    }
}
