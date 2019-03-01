export interface absence
    {
        absenceId: number;
        employeeId: string;
        absenceCreatedByEmployeeId: string;
        createdByUser: string;
        employeeName: string;
        substituteName: string;
        startDate: string;
        endDate: string;
        startTime: Date | string;
        endTime: Date | string;
        absenceReasonId: number;
        absenceStatusDescription: string;
        absenceLocation: string;
        durationType: number;
        positionId: number;
        organizationId: string;
        status: number;
        districtId: number;
        substituteId: string;
        substituteRequired: boolean;
        absenceScope: number;
        payrollNotes: string;
        substituteNotes: string;
        attachedFileName: string;
        fileContentType: string;
        fileExtention: string;
        anyAttachment: boolean;
        approvedDate: Date | string;
        createdDate: Date | string;
        acceptedDate: Date | string;
        absenceReasonDescription: string;
        positionDescription: string;
        subjectDescription: string;
        grade: string;
        interval: number;
        totalInterval: number;
    }