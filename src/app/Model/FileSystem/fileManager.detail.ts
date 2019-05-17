import { Entity } from "../entity";

export class FileManager extends Entity {
    UserId: string;
    AttachedFileName: string;

    fileName: string;
    originalFileName: string; 
    fileExtention: string; 
    fileContentType: string;
    districtId: number; 
    organizationId: string; 
    fileType: number;
}