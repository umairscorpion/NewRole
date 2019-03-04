import { Entity } from "./entity";

export class SubstitutePreference extends Entity {
    userId: string;
    CategoryId : number;
    blockedSubstituteList: string;
    favoriteSubstituteList: string;
}