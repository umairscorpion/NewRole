import { Entity } from "../entity";

export class ReportDetail extends Entity {
  absenceId: number;
  employeeName: string;
  employeeTypeTitle: string;
  absencePosition: number;
  grade: string;
  subject: string;
  reason: string;
  startDate: Date | string;
  endDate: Date | string;
  startTime: string;
  endTime: string;
  districtName: string;
  postedOn: Date | string;
  postedById: string;
  postedByName: string;
  statusId: number;
  statusTitle: string;
  statusDate: Date | string;
  substituteId: string;
  substituteName: string;
  substituteProfilePicUrl: string;
  notes: string;
  attachedFileName: string;
  fileContentType: string;
  anyAttachment: boolean;
  substituteRequired: boolean;
  durationType: string;
  payRate: number;
  dailyHours: number;
  schoolName: string;
}
