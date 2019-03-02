import { Entity } from "./entity";

export class LeaveType extends Entity {
    leaveTypeId: number;
    leaveTypeName: string;
    startingBalance: number;
}