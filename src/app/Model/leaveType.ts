import { Entity } from "./entity";

export class LeaveType extends Entity {
    leaveTypeId: number;
    leaveTypeName: string;
    startingBalance: number;
    isSubtractAllowance: number;
    isApprovalRequired: boolean;
    isVisible: boolean;
    districtId: number;
    organizationId: string;
    createdDate: Date | string;
    modifiedDate: Date | string;
}   