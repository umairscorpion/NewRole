import { Entity } from "./entity";
import { Time } from "@angular/common";

export class TimeClock extends Entity {
userId:string
clockInDate: Date | string
clockInTime: Time
clockOutTime: Time
activity: string
status: number
totalHours: number
totalMinutes: number
}