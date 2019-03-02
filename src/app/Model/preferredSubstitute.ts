import { Entity } from "./entity";

export class PreferredSubstitute extends Entity {
    id: number;
    employeeId: string;
    substituteId: string;
    absenceId: number;
    districtId: number;
    interval: number;
    intervalToSendAll: number;
    createdDate: Date | string;
    substitutePhoneNumber: string;
    isSendAll: boolean;
}