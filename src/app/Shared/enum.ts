export enum DBOperation {
    create = 1,
    update = 2,
    delete = 3
}

export enum AbsenceStatus {
    Submitted = 1,
    Accepted = 2,
    Completed = 3,
    Cancelled = 4,
    NotApplied = 5,
    Approved = 6,
    Rejected = 7,
    Pending = 8
}

export enum UserLevel {
    District = 1,
    Region = 2,
    Organization = 3
}

export enum UserRoleType {
    DistrictAdmin = 1,
    SchoolAdmin ,
    Employee ,
    Substitute ,
    SuperAdmin 
}

