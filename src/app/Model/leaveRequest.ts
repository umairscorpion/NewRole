import { Time } from "../../../node_modules/@angular/common";

export interface leaveRequest {
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