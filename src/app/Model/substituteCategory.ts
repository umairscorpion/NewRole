import { Entity } from "./entity";

export class SubstituteCategory extends Entity {
    id: number;
    typeId: number;
    title: string;
    userId: string;
    isNotificationSend: boolean;
    date: string;
}