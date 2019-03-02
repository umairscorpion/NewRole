import { Time } from "@angular/common";
import { Entity } from "./entity";

export class LocationTime extends Entity  {
    startTime: Time;
    firstHalfEnd: Time;
    secondHalfStart: Time;
    endTime: Time;
}