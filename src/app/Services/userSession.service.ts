import { Injectable } from '@angular/core';
/**
 * Session Service
 *
 * The service contains logined User Information. 
 * Functions in this service used to get user Information on any component
 * Just Import use it
 */
@Injectable()
export class UserSession {
    UserClaim: any;
    constructor() { this.UserClaim = JSON.parse(localStorage.getItem('userClaims')); }

    SetUserSession(): void {
        this.UserClaim = JSON.parse(localStorage.getItem('userClaims'));
    }

    nullUserSession(): void {
        this.UserClaim = null;
    }

    getUserName(): string {
        return this.UserClaim.userName as string;
    }

    getUserId(): string {
        return this.UserClaim.userId as string;
    }

    getUserTypeId(): number {
        return this.UserClaim.userTypeId as number;
    }

    getUserRoleId(): number {
        return this.UserClaim.roleId as number;
    }

    getUserDistrictId(): number {
        return this.UserClaim.districtId as number;
    }

    getUserOrganizationId(): string {
        return this.UserClaim.organizationId as string;
    }

    getUserLevelId(): number {
        return this.UserClaim.userLevel as number;
    }

    getUserEmailId(): string {
        return this.UserClaim.email as string;
    }
}