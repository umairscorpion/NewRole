import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Global } from '../../Shared/global';
import { IEmployee } from '../../Model/Manage/employee';
@Injectable()
export class EmployeeService {
    constructor(private _http: HttpClient) { }
    get(url: string , roleId :number , orgId :number, districtId :number): Observable<IEmployee[]> {
        return this._http.get<IEmployee[]>(Global.baseApiUrl + url +'/' + roleId + '/' + orgId + '/' + districtId);
    }

    searchUser(url: string , SearchText :string ,IsSearchSubstitute: number, orgId :string, districtId :number): Observable<IEmployee[]> {
        return this._http.get<IEmployee[]>(Global.baseApiUrl + url +'/' + SearchText + '/' + IsSearchSubstitute + '/' + orgId + '/' + districtId);
    }

    searchEmployee(url: string , roleId :string , orgId :string, districtId :number): Observable<IEmployee[]> {
        return this._http.get<IEmployee[]>(Global.baseApiUrl + url +'/' + roleId + '/' + orgId + '/' + districtId);
    }

    post(url: string, model: any): Observable<any> {  
        let districtModel = {  
            Name: model.Name ,
            City: model.City ,
            Address: model.Address ,
            ZipCode: model.ZipCode ,
            Country: model.Country ,
            State: model.State ,
            StartTime: model.StartTime ,
            firstHalfEndTime:model.firstHalfEndTime ,
            SecondHaifStartTime:model.SecondHaifStartTime ,
            EndTime:model.EndTime ,
            TimeZone:model.TimeZone ,
            PhoneNo:model.PhoneNo,
            NoOfEmployees:model.NoOfEmployees ,
            NoOfSubstitutes:model.NoOfSubstitutes
            }
        return this._http.post(Global.baseApiUrl + url, districtModel);
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
}