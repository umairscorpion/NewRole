import { Entity } from "./entity";

export class UserResource extends Entity {
    id: number;
    name: string;
    css: string;
    stateMachine: string;
    url: string;
    resourceTypeId: number;
    roleId: number;
    privilegeId: number;
    userId: number;
    showInTopNavigation: boolean;
    showInLeftNavigation: boolean;
}