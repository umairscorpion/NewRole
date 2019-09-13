import { Entity } from "./entity";

export class User extends Entity {
    id: string;
    userId: string;
    userStatusId: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    profilePicture: string;
    emailConfirmed: boolean;
    securityStamp: string;
    isActive: boolean;
    isDeleted: boolean;
    isSubscribedSMS: boolean;
    isSubscribedEmail: boolean;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
    userTypeId: number;
    description: string;
    activationCode: string;
    userFirstName: string;
    userLastName: string;
    createdOn: Date | string | null;
    userIP: string;
    userBrowser: string;
    browserVersion: string;
    operatingSystem: string;
    oSVersion: string;
    device: string;
    roleId: number;
    roleName: string;
    isCertified: number;
    gender: string;
    districtId: number;
    organizationId: string;
    isdeleted: boolean;
    userTypeDescription: string;
    userRoleDesciption: string;
    speciality: string;
    teachingLevel: number;
    userLevel: number;
    categoryId: number;
    lastActive: string;
    jobNumber: number;
    startDate: Date;
    searchType: number;
    reportType: number;
    password: string;
    isWelcomeEmailSend: string;
    jobId: string;
    statusMessage: string;
    userGrade: string;
    userSubject: string;
    organizationName: string;
    userLevelDescription: string;
    userWorkLocation: string; 
}

export class UserSummary extends Entity {
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    roleId: number;
    roleName: string;
}