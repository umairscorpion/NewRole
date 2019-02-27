import { Time } from "@angular/common";

export interface ISchool {
    SchoolName: string ,
    SchoolId: number ,
    SchoolDistrictId : number,
    SchoolCity: number ,
    SchoolAddress: string ,
    SchoolZipCode: string ,
    SchoolEmail: string ,
    SchoolPhone: number,
    SchoolStartTime: Time ,
    School1stHalfEnd: Time ,
    School2ndHalfStart: Time,
    SchoolEndTime: Time,
    SchoolTimeZone: number,
    SchoolEmployees : number
}