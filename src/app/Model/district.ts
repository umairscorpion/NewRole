import { Entity } from "./entity";

export class District extends Entity
    {
        districtName: string;
        districtId: number;
        districtStateId: number;
        city: string;
        districtAddress: string;
        districtPhone: string;
        districtEmail: string;
        districtEmployees: number;
        districtSubstitutes: number;
        districtWorkLoad: number;
        districtStaffingComp: number;
        districtTimeZone: number;
        districtStartTime: Date;
        districtEndTime: Date;
        district1stHalfEnd: Date;
        district2ndHalfStart: Date;
        districtZipCode: number;
        countryId: number;
        countryName: string;
        stateName: string;
        isActive: boolean;
    }