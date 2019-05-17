import { Entity } from "./entity";
import { Time } from "@angular/common";

export class TimeClock extends Entity {
    clockInDate: Date | string
    employeeName: string;
    clockInTime: Time;
    clockOutTime: Time
    userId: string
    firstName: string
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
    location: string;
    timeClockId: number
    startTime: string;
    endTime: string;
}