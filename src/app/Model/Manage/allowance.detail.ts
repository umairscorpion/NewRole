export interface Allowance {
    id: number;
    districtId: number;
    title: string;
    yearlyAllowance: string;
    isDeductAllowance: boolean;
    isResidualDays: boolean;
    isEnalbled: boolean;
    createdDate: Date | string;
    expirationStartDate: Date | string;
    expirationEndDate: Date | string;
    isExpired: boolean;
    isExpiredAtEndOfYear: boolean;
}