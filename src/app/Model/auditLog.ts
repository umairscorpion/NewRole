import { Entity } from "./entity";

export class AuditLog extends Entity {
    id: number;  
    occurredOn: string;
    userId: string;  
    entityId: string;  
    entityType: string;  
    actionType: string; 
    preValue: string;  
    postValue: string;  
    districtId: number;  
    organizationId: string;  
}   

export class AuditLogView extends Entity {
    id: number;  
    occurredOn: string;
    user: string;  
    event: string;  
}

export class AuditLogAbsenceView extends Entity {
    entityId: string;
    entityType: string; 
    created: string; 
    assigned: string; 
    released: string; 
    updated: string; 
    cancelled: string; 
    approved: string; 
    denied: string; 
    declined: string; 
    accepted: string; 
    substituteName: string; 
}

export class AuditFilter {
    loginUserId: string;
    searchByEmployeeName: string;
    startDate: string;
    endDate: string;
    districtId: number;
    organizationId: string;
    entityId: string;
}