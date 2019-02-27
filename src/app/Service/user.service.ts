import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Global } from '../Shared/global';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UserService {
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
    getUserResources(resourceTypeId : number, parentResourceTypeId : number, IsAdminPortal : number) {
        return this._http.get(Global.authenticationApiUrl + 'user/GetUserResources/' + resourceTypeId +'/'+ parentResourceTypeId+'/'+ IsAdminPortal);
    }
    userAuthentication(url: string, model: any): Observable<any> {
        let credentials = JSON.stringify(model);
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
        return this._http.post(Global.authenticationApiUrl + 'auth/login', credentials, { headers: reqHeader });
    }
    userAuthenticationFromGoogle(url: string, model: any): Observable<any> {
        model = JSON.stringify(model);
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
        return this._http.post(Global.authenticationApiUrl + url , model, { headers: reqHeader });
    }

    get(url: string): Observable<any> {
        return this._http.get(url);
    }

    post(url: string, model: any): Observable<any> {    
        return this._http.patch(Global.authenticationApiUrl + url, model);
    }

    put(url: string, id: number, model: any): Observable<any> {
        let body = JSON.stringify(model);
        return this._http.put(url + id, model);
    }

    delete(url: string, id: number): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.delete(url + id);
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

    dailyForecast() {
        return this._http.get("http://samples.openweathermap.org/data/2.5/history/city?q=Warren,OH&appid=b6907d289e10d714a6e88b30761fae22")
          .map(result => result);
      }

}