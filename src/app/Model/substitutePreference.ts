import { Entity } from "./entity";

export class SubstitutePreference extends Entity {
    userId: string;
    blockedSubstituteList: string;
    favoriteSubstituteList: string;
}