import { Entity } from "./entity";

export class Announcement extends Entity {
    announcementId: number;
    recipients: number;
    districtId: number;
    organizationId: string;
    title: string;
    message: string;
    scheduleAnnouncement: boolean;
    showOn: boolean;
    hideOn: boolean;
    showOnDate: Date | string;
    hideOnDate: Date | string;
    showOnTime: string;
    hideOnTime: string;
    isDeleted: boolean;
    createdDate: Date;
    modifiedDate: Date;  
}