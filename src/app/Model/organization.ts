import { Time } from "../../../node_modules/@angular/common";

export interface organization {
    schoolName: string;
    schoolId: string;
    schoolDistrictId: number;
    districtName: string;
    schoolCity: string;
    schoolAddress: string;
    schoolEmail: string;
    schoolPhone: number;
    schoolTimeZone: number;
    schoolStartTime: Time;
    school1stHalfEnd: Time;
    school2ndHalfStart: Time;
    schoolEndTime: Time;
    schoolZipCode: number;
    schoolEmployees: number;
}