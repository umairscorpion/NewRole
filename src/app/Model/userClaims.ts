import { Entity } from "./entity";

export class UserClaims extends Entity {
    userId: string
    userName: string
    userTypeId: string
    firstName: string
    lastName: string
    email: string
    organizationName:string
}