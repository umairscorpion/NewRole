export interface IEmployee {
    UserId: number,
    FirstName: string,
    LastName: string,
    Email: string,
    PhoneNumber: string,
    Password: string,
    IsActive: boolean,
    IsDeleted: boolean,
    IsSubscribedSMS: boolean,
    IsSubscribedEmail: boolean
}