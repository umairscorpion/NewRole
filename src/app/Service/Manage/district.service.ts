import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Global } from '../../Shared/global';
import { IDistrict } from '../../Model/Manage/district';
import { ICountry } from '../../Model/Lookups/country';
import { IStates } from '../../Model/Lookups/states';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DistrictService {
    private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor(private _http: HttpClient) { }
    // get(url: string): Observable<IDistrict> {
    //     return this._http.get<IDistrict>(Global.baseApiUrl + url);
    // }
    get(url: string): Observable<any> {
        return this._http.get<any>(Global.baseApiUrl + url);
    }

    post(url: string, model: Object): Observable<any> {  
        return this._http.post(Global.baseApiUrl + url, model);
    }

    put(url: string, id: number, model: any): Observable<any> {
        let body = JSON.stringify(model);
        return this._http.put(url + id, model);
    }

    delete(url: string, id: number): Observable<any> {
        return this._http.delete(Global.baseApiUrl + url + id);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    //Lookups
    getCountries(url: string): Observable<ICountry> {
        return this._http.get<ICountry>(Global.baseApiUrl + url);
    }
    getStatesByCountryId(url: string, counrtyId : number): Observable<IStates[]> {
        return this._http.get<IStates[]>(Global.baseApiUrl + url + "/" + counrtyId);
    }

}