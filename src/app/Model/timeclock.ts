import { Entity } from "./entity";
import { Time } from "@angular/common";

export class TimeClock extends Entity {
userId:string
clockInDate: Date | string
firstName: string
clockInTime: Time
clockOutTime: Time
totalMinutes: number
startDate: Date | string
endDate: Date | string
activity: string
status: number
totalHours: number
lastName: string
totalBreaks: number
totalNoBreaks: number
schoolName: string
statusId: number
substituteName: string;
employeeName: string;
location: string;
}