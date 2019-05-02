import { Entity } from "./entity";

export class SchoolSubList extends Entity {
    id: number;
    addedByUserId: string;
    modifyByUserId: string;
    substituteId: string;
    substituteName: string;
    districtId: number;
    isAdded: boolean;
    createdDate: Date | string;
    modifiedDate: Date | string;
}