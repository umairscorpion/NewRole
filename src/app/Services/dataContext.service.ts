import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataContext {
    baseUrl = environment.apiUrl;
    private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor(private _http: HttpClient) { }
    //userAuthentication(userName, password) {
    //    var data = "username=" + userName + "&password=" + password + "&grant_type=password";
    //    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    //    return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader });
    //}
    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }
    getUserClaims() {
        return this._http.get(this.baseUrl + 'user/reference/GetUserClaims');
    }
    getUserResources(resourceTypeId: number, parentResourceTypeId: number, IsAdminPortal: number) {
        return this._http.get(this.baseUrl + 'user/GetUserResources/' + resourceTypeId + '/' + parentResourceTypeId + '/' + IsAdminPortal);
    }
    userAuthentication(url: string, model: any): Observable<any> {
        let body = "username=" + model.userName + "&password=" + model.password + "&grant_type=password";
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
        return this._http.post(url + "Token", body, { headers: reqHeader });
    }
    //Funtions For crud operations
    get(url: string): Observable<any> {
        return this._http.get(this.baseUrl + url);
    }

    getById(url: string, Id: number): Observable<any> {
        return this._http.get(this.baseUrl + url + "/" + Id);
    }

    post(url: string, model: any): Observable<any> {
        return this._http.post(this.baseUrl + url, model);
    }

    Patch(url: string, model: any): Observable<any> {
        return this._http.patch(this.baseUrl + url, model);
    }

    put(url: string, id: number, model: any): Observable<any> {
        let body = JSON.stringify(model);
        return this._http.put(url + id, model);
    }

    delete(url: string, id: number): Observable<any> {
        return this._http.delete(this.baseUrl + url + id);
    }

    //miscellaneous Functions
    getUserLocationTime(url: string, userId: string, userLevel: number): Observable<any> {
        return this._http.get(this.baseUrl + url + "/" + userId + "/" + userLevel);
    }

    UpdateAbsenceStatus(url: string, AbsenceId: number, StatusId: number, UpdateStatusDate: string, userId: string): Observable<any> {
        return this._http.get(this.baseUrl + url + "/" + AbsenceId + "/" + StatusId + "/" + UpdateStatusDate + "/" + userId);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
    login() {
        this.loggedIn.next(true);
    }
    logout() {
        this.loggedIn.next(false);
    }

    getFile(url: string, model: any) {
        return this._http.post(this.baseUrl + url, model, { responseType: 'blob' });
    }

    UpdateAbsenceStatusAndSub(url: string, AbsenceId: number, StatusId: number, UpdateStatusDate: string, userId: string, SubstituteId: string, SubstituteRequired: boolean): Observable<any> {
        return this._http.get(this.baseUrl + url + "/" + AbsenceId + "/" + StatusId + "/" + UpdateStatusDate + "/" + userId + "/" + SubstituteId + "/" + SubstituteRequired);
    }

    CancelAbsences(url: string, data: string): Observable<any> {
        return this._http.get(this.baseUrl + url + "/" + data);
    }
}