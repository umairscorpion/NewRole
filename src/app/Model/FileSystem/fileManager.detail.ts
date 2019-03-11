import { Entity } from "../entity";

export class FileManager extends Entity {
    UserId: string;
    AttachedFileName: string;
    FileContentType: string;
}