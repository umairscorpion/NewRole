import { Time } from "../../../node_modules/@angular/common";
import { Entity } from "./entity";

export class LeaveRequest extends Entity {
    leaveRequestId: number;
    employeeName: string;
    employeeId: string;
    createdById: string;
    leaveTypeId: number;
    isApproved: number;
    isDeniend: number;
    leaveTypeName: string;
    description: string;
    startDate: string;
    endDate: string;
    startTime: Time;
    endTime: Time;
    createdDate: string;
    approvedDate: string;
    deniedDate: string;
}