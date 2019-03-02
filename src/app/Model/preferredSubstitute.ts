export interface preferredSubstitute {
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