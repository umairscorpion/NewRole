import { Entity } from "./entity";

export class SubstitutePreference extends Entity {
    userId: string;
    categoryId : number;
    blockedSubstituteList: string;
    favoriteSubstituteList: string;
    categoryName: number;
}