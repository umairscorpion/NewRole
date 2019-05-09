import { Time } from "@angular/common";
import { Entity } from "./entity";

export class Organization extends Entity {
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
    releaseJobTime: string;
    notifyOthersTime: string;
    dailyAbenceLimit: number;
    isAbsenceLimit: boolean;
}