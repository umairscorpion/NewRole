import { Entity } from "./entity";

export class SubstituteCategory extends Entity {
    id: number;
    typeId: number;
    title: string;
    userId: string;
    isNotificationSend: boolean;
    date: string;

// Notification Events For Substitute
notificationId: number;
eventId: number;
emailAlert: boolean;
textAlert: boolean;
eventName: string;
substituteId: string;
isSubscribedEmail: boolean

//Grade Levels for Notifications
gradeNotificationId: number;
teachingLevelId: number;
gradeName: string;
gradeNotification: boolean;

//Grade Levels for Notifications
subjectNotificationId: number;
TeacherSpecialityId: number;
subjectName: string;
subjectNotification: boolean;

}