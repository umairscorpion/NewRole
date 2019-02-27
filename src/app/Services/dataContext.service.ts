import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType  } from '@angular/http';
import { HttpClient, HttpHeaders,  } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Global } from '../Shared/global';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataContext {
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
        return this._http.get(Global.authenticationApiUrl + 'user/reference/GetUserClaims');
    }
    getUserResources(resourceTypeId : number, parentResourceTypeId : number,IsAdminPortal: number) {
        return this._http.get(Global.authenticationApiUrl + 'user/GetUserResources/' + resourceTypeId +'/'+ parentResourceTypeId +'/'+ IsAdminPortal);
    }
    userAuthentication(url: string, model: any): Observable<any> {
        let body = "username=" + model.userName + "&password=" + model.password + "&grant_type=password";
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
        return this._http.post(url + "Token", body, { headers: reqHeader });
    }
    //Funtions For crud operations
    get(url: string): Observable<any> {
        return this._http.get(Global.authenticationApiUrl + url );
    }

    getById(url: string, Id: number): Observable<any> {
        return this._http.get(Global.baseApiUrl + url + "/" + Id);
    }

    post(url: string, model: any): Observable<any> {    
        return this._http.post(Global.authenticationApiUrl + url, model);
    }

    Patch(url: string, model: any): Observable<any> {
        return this._http.patch(Global.baseApiUrl + url , model);
    }

    put(url: string, id: number, model: any): Observable<any> {
        let body = JSON.stringify(model);
        return this._http.put(url + id, model);
    }

    delete(url: string, id: number): Observable<any> {
        return this._http.delete(Global.baseApiUrl + url + id);
    }

    //miscellaneous Functions
    getUserLocationTime(url: string, userId: string,  userLevel: number): Observable<any> {
        return this._http.get(Global.baseApiUrl + url + "/" + userId + "/" + userLevel);
    }

    UpdateAbsenceStatus(url: string, AbsenceId: number, StatusId: number, UpdateStatusDate: string, userId: string): Observable<any> {
        return this._http.get(Global.baseApiUrl + url + "/" + AbsenceId + "/" + StatusId + "/" + UpdateStatusDate + "/" + userId);
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
        return this._http.post(Global.authenticationApiUrl + url, model , {responseType: 'blob' } );
    }
}