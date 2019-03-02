import { Time } from "@angular/common";

export interface employeeSchedule {
    startDate: Date | string;
    endDate: Date | string;
    startTime: Time;
    endTime: Time;
}