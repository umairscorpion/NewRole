import { Time } from "@angular/common";
import { Entity } from "./entity";

export class EmployeeSchedule extends Entity {
    startDate: Date | string;
    endDate: Date | string;
    startTime: Time;
    endTime: Time;
}